import deliveryInfoService from "../services/deliveryInfo.service.js";

class DeliveryInfoController {
  /**
   * Add new delivery information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addDeliveryInfo(req, res) {
    try {
      const { userId } = req.params;
      const result = await deliveryInfoService.addDeliveryInfo(userId, req.body);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error adding delivery info:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get delivery information by delivery ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDeliveryInfoById(req, res) {
    try {
      const { deliveryId } = req.params;
      const result = await deliveryInfoService.getDeliveryInfoById(deliveryId);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching delivery info by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get delivery information by user ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDeliveryInfoByUserId(req, res) {
    try {
      const { userId } = req.params;
      const result = await deliveryInfoService.getDeliveryInfoByUserId(userId);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching delivery info by user ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Update delivery information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateDeliveryInfo(req, res) {
    try {
      const { id } = req.params;
      const result = await deliveryInfoService.updateDeliveryInfo(id, req.body);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Error updating delivery info:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Delete delivery information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteDeliveryInfo(req, res) {
    try {
      const { id } = req.params;
      const result = await deliveryInfoService.deleteDeliveryInfo(id);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Error deleting delivery info:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get all delivery information (admin use)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllDeliveryInfo(req, res) {
    try {
      const result = await deliveryInfoService.getAllDeliveryInfo();
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching all delivery info:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get delivery information by district
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDeliveryInfoByDistrict(req, res) {
    try {
      const { district } = req.params;
      const result = await deliveryInfoService.getDeliveryInfoByDistrict(district);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching delivery info by district:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new DeliveryInfoController();
