import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

class AuthService {
  /**
   * Verify JWT token and get user information
   * @param {string} token - JWT token to verify
   * @returns {Object} - User information or error status
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
            const user = await User.findById(data._id);
            if (user) {
              resolve({ status: true, userID: user._id, user });
            } else {
              resolve({ status: false, message: "User not found" });
            }
          }
        });
      });
    } catch (error) {
      return { status: false, message: "Token verification failed", error: error.message };
    }
  }

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} - Authentication result with token or error
   */
  async authenticateUser(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, status: 401, message: "Invalid Email or Password" };
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return { success: false, status: 401, message: "Invalid Email or Password" };
      }

      // Generate token
      const token = user.generateAuthToken();
      return { 
        success: true, 
        status: 200, 
        token, 
        message: "Logged in successfully",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
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

export default new AuthService();
