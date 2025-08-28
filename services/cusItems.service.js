import { Item } from "../models/itemsModel.js";
import { Order } from "../models/orderModel.js";

class CusItemsService {
  /**
   * Calculate dynamic pricing for an item based on recent sales
   * @param {Object} item - Item object
   * @returns {Object} - Item with updated pricing
   */
  async calculateDynamicPricing(item) {
    try {
      const startDate = new Date();
      const endDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const sales = await Order.aggregate([
        { $unwind: "$products" },
        {
          $match: {
            "products.productId": item.productId,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$products.productId",
            totalQuantity: { $sum: "$products.quantity" },
          },
        },
      ]);

      const totalQuantity = sales.length > 0 ? sales[0].totalQuantity : 0;
      const priceChanged = item.priceincrease * (totalQuantity / item.salesdifference);
      const newPrice = item.minprice + priceChanged;
      
      // Ensure price doesn't exceed maximum price
      if (newPrice > item.maxprice) {
        item.minprice = item.maxprice;
      } else {
        item.minprice = newPrice;
      }

      return item;
    } catch (error) {
      console.error('Error calculating dynamic pricing:', error);
      throw error;
    }
  }

  /**
   * Get trending items with dynamic pricing
   * @returns {Object} Response object with status and data
   */
  async getTrendingItemsWithPricing() {
    try {
      const items = await Item.find({ trending: true });

      if (!items || items.length === 0) {
        return { status: 404, message: 'No trending items found' };
      }

      const itemsWithPricing = await Promise.all(
        items.map(async (item) => {
          return await this.calculateDynamicPricing(item);
        })
      );

      return { status: 200, data: itemsWithPricing };
    } catch (error) {
      console.error('Error in getTrendingItemsWithPricing service:', error);
      throw error;
    }
  }

  /**
   * Get all items with dynamic pricing
   * @returns {Object} Response object with status and data
   */
  async getAllItemsWithPricing() {
    try {
      const items = await Item.find({});

      if (!items || items.length === 0) {
        return { status: 404, message: 'No items found' };
      }

      const itemsWithPricing = await Promise.all(
        items.map(async (item) => {
          return await this.calculateDynamicPricing(item);
        })
      );

      return { status: 200, data: itemsWithPricing };
    } catch (error) {
      console.error('Error in getAllItemsWithPricing service:', error);
      throw error;
    }
  }

  /**
   * Get a single item by ID with dynamic pricing
   * @param {string} id - Item ID
   * @returns {Object} Response object with status and data
   */
  async getItemByIdWithPricing(id) {
    try {
      const item = await Item.findById(id);

      if (!item) {
        return { status: 404, message: 'Item not found' };
      }

      const itemWithPricing = await this.calculateDynamicPricing(item);

      return { status: 200, data: itemWithPricing };
    } catch (error) {
      console.error('Error in getItemByIdWithPricing service:', error);
      throw error;
    }
  }

  /**
   * Get items by productId with dynamic pricing
   * @param {string} productId - Product ID
   * @returns {Object} Response object with status and data
   */
  async getItemByProductIdWithPricing(productId) {
    try {
      const item = await Item.findOne({ productId });

      if (!item) {
        return { status: 404, message: 'Item not found' };
      }

      const itemWithPricing = await this.calculateDynamicPricing(item);

      return { status: 200, data: itemWithPricing };
    } catch (error) {
      console.error('Error in getItemByProductIdWithPricing service:', error);
      throw error;
    }
  }

  /**
   * Get items by category with dynamic pricing
   * @param {string} category - Item category
   * @returns {Object} Response object with status and data
   */
  async getItemsByCategoryWithPricing(category) {
    try {
      const items = await Item.find({ category });

      if (!items || items.length === 0) {
        return { status: 404, message: 'No items found in this category' };
      }

      const itemsWithPricing = await Promise.all(
        items.map(async (item) => {
          return await this.calculateDynamicPricing(item);
        })
      );

      return { status: 200, data: itemsWithPricing };
    } catch (error) {
      console.error('Error in getItemsByCategoryWithPricing service:', error);
      throw error;
    }
  }

  /**
   * Search items by name with dynamic pricing
   * @param {string} searchTerm - Search term for item name
   * @returns {Object} Response object with status and data
   */
  async searchItemsWithPricing(searchTerm) {
    try {
      const items = await Item.find({
        name: { $regex: searchTerm, $options: 'i' }
      });

      if (!items || items.length === 0) {
        return { status: 404, message: 'No items found matching search criteria' };
      }

      const itemsWithPricing = await Promise.all(
        items.map(async (item) => {
          return await this.calculateDynamicPricing(item);
        })
      );

      return { status: 200, data: itemsWithPricing };
    } catch (error) {
      console.error('Error in searchItemsWithPricing service:', error);
      throw error;
    }
  }
}

export default new CusItemsService();
