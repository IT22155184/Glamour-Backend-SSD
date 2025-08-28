import empAuthService from "../services/empAuth.service.js";

class EmpAuthController {
  /**
   * Verify JWT token for employee
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      const result = await empAuthService.verifyToken(token);
      
      if (result.status) {
        return res.json({ status: true, empID: result.empID });
      } else {
        return res.json({ status: false });
      }
    } catch (error) {
      console.error("Employee token verification error:", error);
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
  }

  /**
   * Authenticate employee login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const result = await empAuthService.authenticateEmployee(email, password);
      
      return res.status(result.status).json({
        token: result.token,
        message: result.message,
        emp: result.emp
      });
    } catch (error) {
      console.error("Employee login error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new EmpAuthController();
