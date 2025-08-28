import authService from "../services/auth.service.js";

class AuthController {
  /**
   * Verify JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      const result = await authService.verifyToken(token);
      
      if (result.status) {
        return res.json({ status: true, userID: result.userID });
      } else {
        return res.json({ status: false });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
  }

  /**
   * Authenticate user login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const result = await authService.authenticateUser(email, password);
      
      return res.status(result.status).json({
        token: result.token,
        message: result.message,
        user: result.user
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new AuthController();
