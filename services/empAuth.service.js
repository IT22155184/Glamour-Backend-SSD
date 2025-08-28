import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Emp } from "../models/empModel.js";

class EmpAuthService {
  /**
   * Verify JWT token and get employee information
   * @param {string} token - JWT token to verify
   * @returns {Object} - Employee information or error status
   */
  async verifyToken(token) {
    try {
      if (!token) {
        return { status: false, message: "No token provided" };
      }

      return new Promise((resolve) => {
        jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, data) => {
          if (err) {
            resolve({ status: false, message: "Invalid token" });
          } else {
            const emp = await Emp.findById(data._id);
            if (emp) {
              resolve({ status: true, empID: emp._id, emp });
            } else {
              resolve({ status: false, message: "Employee not found" });
            }
          }
        });
      });
    } catch (error) {
      return { status: false, message: "Token verification failed", error: error.message };
    }
  }

  /**
   * Authenticate employee with email and password
   * @param {string} email - Employee email
   * @param {string} password - Employee password
   * @returns {Object} - Authentication result with token or error
   */
  async authenticateEmployee(email, password) {
    try {
      // Find employee by email
      const emp = await Emp.findOne({ email });
      if (!emp) {
        return { success: false, status: 401, message: "Invalid Email or Password" };
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, emp.password);
      if (!validPassword) {
        return { success: false, status: 401, message: "Invalid Email or Password" };
      }

      // Generate token
      const token = emp.generateAuthToken();
      return { 
        success: true, 
        status: 200, 
        token, 
        message: "Logged in successfully",
        emp: {
          id: emp._id,
          email: emp.email,
          firstName: emp.firstName,
          lastName: emp.lastName,
          role: emp.role
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
}

export default new EmpAuthService();
