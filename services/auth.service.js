import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

class AuthService {
  /**
   * Verify JWT token and get user information
   * @param {string} token - JWT token to verify
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - User information or error status
   */
  async verifyToken(token, userType = 'customer') {
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
            if (user && user.role === userType) {
              const responseKey = userType === 'employee' ? 'empID' : 'userID';
              resolve({ 
                status: true, 
                [responseKey]: user._id, 
                user,
                [userType]: user 
              });
            } else {
              resolve({ status: false, message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` });
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
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - Authentication result with token or error
   */
  async authenticate(email, password, userType = 'customer') {
    try {
      // Find user by email and role
      const user = await User.findOne({ email, role: userType });
      if (!user) {
        return { success: false, status: 401, message: "Invalid Email or Password" };
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return { success: false, status: 401, message: "Invalid Email or Password" };
      }

      console.log("Authenticated User:", user);
      // Generate token
      const token = user.generateAuthToken();
      
      return { 
        success: true, 
        status: 200, 
        token, 
        message: "Logged in successfully",
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
