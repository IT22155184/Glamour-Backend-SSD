import userService from "../services/userService.js";

class UserController {
  /**
   * Create a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createUser(req, res) {
    try {
      const result = await userService.createUser(req.body);
      
      return res.status(result.status).json({
        message: result.message,
        user: result.user
      });
    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Update user details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.updateUser(id, req.body);
      
      return res.status(result.status).json({
        message: result.message,
        user: result.user
      });
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Delete a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      
      return res.status(result.status).json({
        message: result.message
      });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.getUserById(id);
      
      if (result.success) {
        return res.status(result.status).json(result.user);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserController();
