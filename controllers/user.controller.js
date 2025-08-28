import userService from "../services/user.service.js";

class UserController {
  /**
   * Create a new user (customer or employee)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createUser(req, res) {
    try {
      const { userType = 'customer' } = req.query;
      const result = await userService.createUser(req.body, userType);
      
      return res.status(result.status).json({
        success: result.success,
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
      const { userType = 'customer' } = req.query;
      const result = await userService.updateUser(id, req.body, userType);
      
      return res.status(result.status).json({
        success: result.success,
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
      const { userType = 'customer' } = req.query;
      const result = await userService.deleteUser(id, userType);
      
      return res.status(result.status).json({
        success: result.success,
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
      const { userType = 'customer' } = req.query;
      const result = await userService.getUserById(id, userType);
      
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

  /**
   * Get all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllUsers(req, res) {
    try {
      const { userType = 'all' } = req.query;
      const result = await userService.getAllUsers(userType);
      
      return res.status(result.status).json({
        success: result.success,
        users: result.users,
        count: result.count,
        userType: result.userType
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get user by email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const { userType = 'customer' } = req.query;
      const result = await userService.getUserByEmail(email, userType);
      
      if (result.success) {
        return res.status(result.status).json(result.user);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get user by email error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Update user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const { userType = 'customer' } = req.query;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const result = await userService.updateUserPassword(id, password, userType);
      
      return res.status(result.status).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      console.error("Update password error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserController();
