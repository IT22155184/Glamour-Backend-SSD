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
            if (user) {
              // Check if userType matches the token's role or if it's a Google OAuth user
              if (user.role === userType || user.googleId) {
                const responseKey = user.role === 'employee' ? 'empID' : 'userID';
                resolve({ 
                  status: true, 
                  [responseKey]: user._id, 
                  user,
                  [user.role]: user 
                });
              } else {
                resolve({ status: false, message: `User type mismatch` });
              }
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
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - Authentication result with tokens and user info
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
      
      // Generate tokens
      const accessToken = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();
      
      // Save refresh token to user
      await user.addRefreshToken(refreshToken);
      
      // Get user info without sensitive data
      const userInfo = user.toJSON();
      
      return { 
        success: true, 
        status: 200, 
        accessToken,
        refreshToken,
        user: userInfo,
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

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} - New access token or error
   */
  async refreshAccessToken(refreshToken) {
    try {
      if (!refreshToken) {
        return { success: false, status: 401, message: "Refresh token is required" };
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWTPRIVATEKEY);
      
      // Find user and check if refresh token exists
      const user = await User.findById(decoded._id);
      if (!user) {
        return { success: false, status: 401, message: "Invalid refresh token" };
      }

      const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken);
      if (!tokenExists) {
        return { success: false, status: 401, message: "Invalid refresh token" };
      }

      // Generate new access token
      const newAccessToken = user.generateAuthToken();
      
      return {
        success: true,
        status: 200,
        accessToken: newAccessToken,
        user: user.toJSON(),
        message: "Token refreshed successfully"
      };
    } catch (error) {
      return {
        success: false,
        status: 401,
        message: "Invalid refresh token",
        error: error.message
      };
    }
  }

  /**
   * Logout user by removing refresh token
   * @param {string} refreshToken - Refresh token to remove
   * @param {string} userId - User ID
   * @returns {Object} - Logout result
   */
  async logout(refreshToken, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, status: 404, message: "User not found" };
      }

      await user.removeRefreshToken(refreshToken);
      
      return {
        success: true,
        status: 200,
        message: "Logged out successfully"
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
   * Logout from all devices by removing all refresh tokens
   * @param {string} userId - User ID
   * @returns {Object} - Logout result
   */
  async logoutAll(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, status: 404, message: "User not found" };
      }

      user.refreshTokens = [];
      await user.save();
      
      return {
        success: true,
        status: 200,
        message: "Logged out from all devices successfully"
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
