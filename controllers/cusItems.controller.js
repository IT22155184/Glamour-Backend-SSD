import cusItemsService from "../services/cusItems.service.js";

class CusItemsController {
  /**
   * Get trending items with dynamic pricing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTrendingItems(req, res) {
    try {
      const result = await cusItemsService.getTrendingItemsWithPricing();
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching trending items:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get all items with dynamic pricing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllItems(req, res) {
    try {
      const result = await cusItemsService.getAllItemsWithPricing();
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching all items:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get a single item by ID with dynamic pricing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const result = await cusItemsService.getItemByIdWithPricing(id);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new CusItemsController();
