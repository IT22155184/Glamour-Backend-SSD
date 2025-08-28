import empService from "../services/emp.service.js";

class EmpController {
  /**
   * Create a new employee
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createEmployee(req, res) {
    try {
      const result = await empService.createEmployee(req.body);
      
      return res.status(result.status).json({
        message: result.message,
        employee: result.employee
      });
    } catch (error) {
      console.error("Create employee error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Update employee details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const result = await empService.updateEmployee(id, req.body);
      
      return res.status(result.status).json({
        message: result.message,
        employee: result.employee
      });
    } catch (error) {
      console.error("Update employee error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Delete an employee
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const result = await empService.deleteEmployee(id);
      
      return res.status(result.status).json({
        message: result.message
      });
    } catch (error) {
      console.error("Delete employee error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get all employees
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllEmployees(req, res) {
    try {
      const result = await empService.getAllEmployees();
      
      if (result.success) {
        return res.status(result.status).json(result.employees);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get all employees error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get employee by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const result = await empService.getEmployeeById(id);
      
      if (result.success) {
        return res.status(result.status).json(result.employee);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get employee error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get employee by email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getEmployeeByEmail(req, res) {
    try {
      const { email } = req.params;
      const result = await empService.getEmployeeByEmail(email);
      
      if (result.success) {
        return res.status(result.status).json(result.employee);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get employee by email error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Update employee password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateEmployeePassword(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      const result = await empService.updateEmployeePassword(id, currentPassword, newPassword);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Update employee password error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Search employees
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchEmployees(req, res) {
    try {
      const { query } = req.query;
      const result = await empService.searchEmployees(query);
      
      if (result.success) {
        return res.status(result.status).json({
          employees: result.employees,
          count: result.count
        });
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Search employees error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get employees by role
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getEmployeesByRole(req, res) {
    try {
      const { role } = req.params;
      const result = await empService.getEmployeesByRole(role);
      
      if (result.success) {
        return res.status(result.status).json({
          employees: result.employees,
          count: result.count
        });
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get employees by role error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get employee statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getEmployeeStatistics(req, res) {
    try {
      const result = await empService.getEmployeeStatistics();
      
      if (result.success) {
        return res.status(result.status).json(result.statistics);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get employee statistics error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new EmpController();
