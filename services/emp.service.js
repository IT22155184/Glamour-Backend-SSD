import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

class EmpService {
  /**
   * Create a new employee
   * @param {Object} empData - Employee registration data
   * @returns {Object} - Creation result
   */
  async createEmployee(empData) {
    try {
      // Check if employee already exists
      const existingEmp = await User.findOne({ email: empData.email });
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
      const newUser = new User({ ...empData, password: hashPassword, role: 'employee' });
      await newUser.save();

      return { 
        success: true, 
        status: 201, 
        message: "Employee created successfully",
        employee: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
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
      const emp = await User.findOne({ _id: empId, role: 'employee' });
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
        const emailExists = await User.findOne({ email: updateData.email });
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
      const emp = await User.findOneAndDelete({ _id: empId, role: 'employee' });

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
      const employees = await User.find({ role: 'employee' }).select('-password');
      
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
   * Update employee details
   * @param {string} empId - Employee ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Update result
   */
  async updateEmployee(empId, updateData) {
    try {
      const emp = await User.findOne({ _id: empId, role: 'employee' });
      if (!emp) {
        return {
          success: false,
          status: 404,
          message: "Employee not found"
        };
      }

      // Update basic fields if provided
      if (updateData.firstName) {
        emp.firstName = updateData.firstName.trim();
      }

      if (updateData.lastName) {
        emp.lastName = updateData.lastName.trim();
      }

      // Check if the email is being updated, and if it's already taken
      if (updateData.email && updateData.email !== emp.email) {
        const emailExists = await User.findOne({ email: updateData.email });
        if (emailExists) {
          return {
            success: false,
            status: 409,
            message: "Email already in use"
          };
        }
        emp.email = updateData.email.toLowerCase().trim();
      }

      // Update the phone number if provided
      if (updateData.phoneNumber) {
        emp.phoneNumber = updateData.phoneNumber.trim();
      }

      // Update the role if provided
      if (updateData.role) {
        emp.role = updateData.role;
      }

      // Update the password if provided (and hash it)
      if (updateData.password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(updateData.password, salt);
        emp.password = hashedPassword;
      }

      // Update other fields if provided
      if (updateData.department) {
        emp.department = updateData.department.trim();
      }

      if (updateData.position) {
        emp.position = updateData.position.trim();
      }

      emp.updatedAt = new Date();

      // Save the updated employee to the database
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
          phoneNumber: emp.phoneNumber,
          role: emp.role,
          department: emp.department,
          position: emp.position
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
   * Delete an employee
   * @param {string} empId - Employee ID
   * @returns {Object} - Deletion result
   */
  async deleteEmployee(empId) {
    try {
      const emp = await User.findOneAndDelete({ _id: empId, role: 'employee' });

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
   * Get employee by email
   * @param {string} email - Employee email
   * @returns {Object} - Employee data or error
   */
  async getEmployeeByEmail(email) {
    try {
      const emp = await User.findOne({ email }).select('-password');
      
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

  /**
   * Update employee password with current password verification
   * @param {string} empId - Employee ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Object} - Update result
   */
  async updateEmployeePassword(empId, currentPassword, newPassword) {
    try {
      const emp = await User.findOne({ _id: empId, role: 'employee' });
      if (!emp) {
        return {
          success: false,
          status: 404,
          message: "Employee not found"
        };
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, emp.password);
      if (!validPassword) {
        return {
          success: false,
          status: 400,
          message: "Current password is incorrect"
        };
      }

      // Hash new password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      emp.password = hashedPassword;
      emp.updatedAt = new Date();
      await emp.save();

      return {
        success: true,
        status: 200,
        message: "Password updated successfully"
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
   * Search employees by name or email
   * @param {string} searchQuery - Search query
   * @returns {Object} - Search results
   */
  async searchEmployees(searchQuery) {
    try {
      if (!searchQuery || searchQuery.trim() === '') {
        return {
          success: false,
          status: 400,
          message: "Search query is required"
        };
      }

      const employees = await User.find({
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { department: { $regex: searchQuery, $options: 'i' } },
          { position: { $regex: searchQuery, $options: 'i' } }
        ]
      }).select('-password').sort({ firstName: 1 });

      return {
        success: true,
        status: 200,
        employees,
        count: employees.length
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
   * Get employees by role
   * @param {string} role - Employee role
   * @returns {Object} - Employees with specified role
   */
  async getEmployeesByRole(role) {
    try {
      const employees = await User.find({ role }).select('-password').sort({ firstName: 1 });

      return {
        success: true,
        status: 200,
        employees,
        count: employees.length
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
   * Get employee statistics
   * @returns {Object} - Employee statistics
   */
  async getEmployeeStatistics() {
    try {
      const totalEmployees = await User.countDocuments();
      
      const roleStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const departmentStats = await User.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        success: true,
        status: 200,
        statistics: {
          totalEmployees,
          roleDistribution: roleStats,
          departmentDistribution: departmentStats
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
   * Get employee by ID
   * @param {string} empId - Employee ID
   * @returns {Object} - Employee data or error
   */
  async getEmployeeById(empId) {
    try {
      const emp = await User.findOne({ _id: empId, role: 'employee' }).select('-password');
      
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
