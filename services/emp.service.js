import bcrypt from "bcrypt";
import { Emp } from "../models/empModel.js";

class EmpService {
  /**
   * Create a new employee
   * @param {Object} empData - Employee registration data
   * @returns {Object} - Creation result
   */
  async createEmployee(empData) {
    try {
      // Check if employee already exists
      const existingEmp = await Emp.findOne({ email: empData.email });
      if (existingEmp) {
        return { 
          success: false, 
          status: 409, 
          message: "Employee with given email already exists!" 
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(empData.password, salt);

      // Create new employee
      const newEmp = new Emp({ ...empData, password: hashPassword });
      await newEmp.save();

      return { 
        success: true, 
        status: 201, 
        message: "Employee created successfully",
        employee: {
          id: newEmp._id,
          email: newEmp.email,
          firstName: newEmp.firstName,
          lastName: newEmp.lastName,
          role: newEmp.role
        }
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Update employee details
   * @param {string} empId - Employee ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Update result
   */
  async updateEmployee(empId, updateData) {
    try {
      const emp = await Emp.findById(empId);
      if (!emp) {
        return { 
          success: false, 
          status: 404, 
          message: "Employee not found" 
        };
      }

      // Update fields if provided
      if (updateData.firstName) {
        emp.firstName = updateData.firstName;
      }

      if (updateData.lastName) {
        emp.lastName = updateData.lastName;
      }

      // Check if the email is being updated, and if it's already taken
      if (updateData.email && updateData.email !== emp.email) {
        const emailExists = await Emp.findOne({ email: updateData.email });
        if (emailExists) {
          return { 
            success: false, 
            status: 409, 
            message: "Email already in use" 
          };
        }
        emp.email = updateData.email;
      }

      if (updateData.phoneNumber) {
        emp.phoneNumber = updateData.phoneNumber;
      }

      if (updateData.role) {
        emp.role = updateData.role;
      }

      // Update password if provided
      if (updateData.password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(updateData.password, salt);
        emp.password = hashedPassword;
      }

      await emp.save();

      return { 
        success: true, 
        status: 200, 
        message: "Employee updated successfully",
        employee: {
          id: emp._id,
          email: emp.email,
          firstName: emp.firstName,
          lastName: emp.lastName,
          role: emp.role,
          phoneNumber: emp.phoneNumber
        }
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Delete employee by ID
   * @param {string} empId - Employee ID
   * @returns {Object} - Deletion result
   */
  async deleteEmployee(empId) {
    try {
      const emp = await Emp.findByIdAndDelete(empId);

      if (!emp) {
        return { 
          success: false, 
          status: 404, 
          message: "Employee not found" 
        };
      }

      return { 
        success: true, 
        status: 200, 
        message: "Employee deleted successfully" 
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Get all employees
   * @returns {Object} - All employees or error
   */
  async getAllEmployees() {
    try {
      const employees = await Emp.find({}).select('-password');
      
      return { 
        success: true, 
        status: 200, 
        employees
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Get employee by ID
   * @param {string} empId - Employee ID
   * @returns {Object} - Employee data or error
   */
  async getEmployeeById(empId) {
    try {
      const emp = await Emp.findById(empId).select('-password');
      
      if (!emp) {
        return { 
          success: false, 
          status: 404, 
          message: "Employee not found" 
        };
      }

      return { 
        success: true, 
        status: 200, 
        employee: emp
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }
}

export default new EmpService();
