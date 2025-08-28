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
}

export default new EmpController();
