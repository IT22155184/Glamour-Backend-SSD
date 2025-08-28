import itemService from "../services/itemService.js";

class ItemController {
  /**
   * Create a new item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createItem(req, res) {
    try {
      const result = await itemService.createItem(req.body);
      
      if (result.success) {
        return res.status(result.status).json(result.item);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Create item error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get all items
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllItems(req, res) {
    try {
      const result = await itemService.getAllItems();
      
      if (result.success) {
        return res.status(result.status).json(result.items);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get all items error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get item by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const result = await itemService.getItemById(id);
      
      if (result.success) {
        return res.status(result.status).json(result.item);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get item by ID error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Update item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const result = await itemService.updateItem(id, req.body);
      
      return res.status(result.status).json({ 
        message: result.message,
        item: result.item 
      });
    } catch (error) {
      console.error("Update item error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Delete item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const result = await itemService.deleteItem(id);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Delete item error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get trending items
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTrendingItems(req, res) {
    try {
      const result = await itemService.getTrendingItems();
      
      if (result.success) {
        return res.status(result.status).json(result.items);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get trending items error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new ItemController();
