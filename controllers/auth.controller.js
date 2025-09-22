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
        return res.status(400).json({ success: false, message: "Token is required" });
      }

      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return res.status(400).json({ success: false, message: "Invalid user type. Must be 'customer' or 'employee'" });
      }

      const result = await authService.verifyToken(token, userType);
      
      if (result.status) {
        return res.json({ 
          success: true,
          user: result.user,
          userType: result.user.role,
          userId: result.user._id
        });
      } else {
        return res.json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
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
        user: result.user,
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
   * Handle Google OAuth callback
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async googleOAuthCallback(req, res) {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      // Generate tokens for the authenticated user
      const accessToken = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();
      
      // Store refresh token
      await user.addRefreshToken(refreshToken);

      // For web app, set tokens as secure, HTTP-only cookies and redirect to frontend callback page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      res.cookie('accessToken', accessToken, {
        httpOnly: false, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Redirect to frontend callback page (no tokens in URL)
      res.redirect(`${frontendUrl}/oauth/callback`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProfile(req, res) {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "User not authenticated" 
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name || `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          googleId: user.googleId
        }
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  }
}

export default new AuthController();
