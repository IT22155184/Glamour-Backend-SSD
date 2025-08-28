import { Item } from "../models/itemsModel.js";

class ItemService {
  /**
   * Create a new item
   * @param {Object} itemData - Item data
   * @returns {Object} - Creation result
   */
  async createItem(itemData) {
    try {
      // Validate required fields
      const requiredFields = [
        'productId', 'name', 'description', 'minprice', 'maxprice',
        'salesdifference', 'priceincrease', 'category', 'image',
        'trending', 'stock', 'colors', 'sizes'
      ];

      const missingFields = requiredFields.filter(field => !itemData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          status: 400,
          message: `Missing required fields: ${missingFields.join(', ')}`
        };
      }

      const newItem = {
        productId: itemData.productId,
        name: itemData.name,
        description: itemData.description,
        minprice: itemData.minprice,
        maxprice: itemData.maxprice,
        salesdifference: itemData.salesdifference,
        priceincrease: itemData.priceincrease,
        category: itemData.category,
        image: itemData.image,
        trending: itemData.trending,
        stock: itemData.stock,
        colors: itemData.colors,
        sizes: itemData.sizes
      };

      const item = await Item.create(newItem);

      return {
        success: true,
        status: 201,
        item
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }

  /**
   * Get all items
   * @returns {Object} - All items or error
   */
  async getAllItems() {
    try {
      const items = await Item.find({});
      return {
        success: true,
        status: 200,
        items
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }

  /**
   * Get item by ID
   * @param {string} itemId - Item ID
   * @returns {Object} - Item data or error
   */
  async getItemById(itemId) {
    try {
      const item = await Item.findById(itemId);
      
      if (!item) {
        return {
          success: false,
          status: 404,
          message: "Item not found"
        };
      }

      return {
        success: true,
        status: 200,
        item
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }

  /**
   * Update item
   * @param {string} itemId - Item ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Update result
   */
  async updateItem(itemId, updateData) {
    try {
      const result = await Item.findByIdAndUpdate(itemId, updateData, { new: true });

      if (!result) {
        return {
          success: false,
          status: 404,
          message: "Item not found"
        };
      }

      return {
        success: true,
        status: 200,
        message: "Item updated successfully",
        item: result
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }

  /**
   * Delete item
   * @param {string} itemId - Item ID
   * @returns {Object} - Deletion result
   */
  async deleteItem(itemId) {
    try {
      const result = await Item.findByIdAndDelete(itemId);

      if (!result) {
        return {
          success: false,
          status: 404,
          message: "Item not found"
        };
      }

      return {
        success: true,
        status: 200,
        message: "Item deleted successfully"
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }

  /**
   * Get trending items
   * @returns {Object} - Trending items or error
   */
  async getTrendingItems() {
    try {
      const items = await Item.find({ trending: true });
      return {
        success: true,
        status: 200,
        items
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }
}

export default new ItemService();
