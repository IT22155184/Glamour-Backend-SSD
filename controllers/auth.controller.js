import authService from "../services/auth.service.js";

class AuthController {
  /**
   * Unified token verification for both users and employees
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyToken(req, res) {
    try {
      const { token, userType = 'customer' } = req.body;
      
      if (!token) {
        return res.status(400).json({ status: false, message: "Token is required" });
      }

      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return res.status(400).json({ status: false, message: "Invalid user type. Must be 'customer' or 'employee'" });
      }

      const result = await authService.verifyToken(token, userType);
      
      if (result.status) {
        return res.json({ 
          status: true,
          user: result.user,
          userType: result.user.role,
          userId: result.user._id
        });
      } else {
        return res.json({ status: false, message: result.message });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
  }

  /**
   * Unified login for both users and employees
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password, userType = 'customer' } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type. Must be 'customer' or 'employee'" });
      }

      const result = await authService.authenticate(email, password, userType);
    
      if (result.success) {
        return res.status(result.status).json({
          success: result.success,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
          message: result.message,
          userType: userType
        });
      } else {
        return res.status(result.status).json({
          success: result.success,
          message: result.message
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      const result = await authService.refreshAccessToken(refreshToken);
      
      return res.status(result.status).json({
        success: result.success,
        accessToken: result.accessToken,
        message: result.message
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Logout user by removing refresh token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user?._id; // Assuming user is attached by middleware
      
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      const result = await authService.logout(refreshToken, userId);
      
      return res.status(result.status).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Logout from all devices
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logoutAll(req, res) {
    try {
      const userId = req.user?._id; // Assuming user is attached by middleware
      
      if (!userId) {
        return res.status(400).json({ message: "User not authenticated" });
      }

      const result = await authService.logoutAll(userId);
      
      return res.status(result.status).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      console.error("Logout all error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProfile(req, res) {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      return res.json({
        success: true,
        user: user.toJSON(),
        message: "Profile retrieved successfully"
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new AuthController();
