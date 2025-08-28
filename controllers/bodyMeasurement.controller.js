import bodyMeasurementService from "../services/bodyMeasurement.service.js";

class BodyMeasurementController {
  /**
   * Retrieve body measurements within a date range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMeasurementsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const result = await bodyMeasurementService.getMeasurementsByDateRange(startDate, endDate);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error retrieving measurements by date range:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Create a new body measurement
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createMeasurement(req, res) {
    try {
      const result = await bodyMeasurementService.createMeasurement(req.body);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error creating measurement:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Update an existing body measurement
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateMeasurement(req, res) {
    try {
      const { id } = req.params;
      const result = await bodyMeasurementService.updateMeasurement(id, req.body);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error updating measurement:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get all body measurements
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllMeasurements(req, res) {
    try {
      const result = await bodyMeasurementService.getAllMeasurements();
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching all measurements:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get a single body measurement by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMeasurementById(req, res) {
    try {
      const { id } = req.params;
      const result = await bodyMeasurementService.getMeasurementById(id);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching measurement by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get body measurement by user ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMeasurementByUserId(req, res) {
    try {
      const { userID } = req.params;
      const result = await bodyMeasurementService.getMeasurementByUserId(userID);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching measurement by user ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Delete a body measurement
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteMeasurement(req, res) {
    try {
      const { id } = req.params;
      const result = await bodyMeasurementService.deleteMeasurement(id);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Error deleting measurement:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new BodyMeasurementController();
