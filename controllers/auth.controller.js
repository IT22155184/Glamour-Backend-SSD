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
    
      
      return res.status(result.status).json({
        success: result.success,
        token: result.token,
        message: result.message,
        userType: userType
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new AuthController();
