import { Order } from "../models/orderModel.js";

class OrderService {
  /**
   * Get all ongoing orders
   * @returns {Object} - Ongoing orders or error
   */
  async getOngoingOrders() {
    try {
      const orders = await Order.find({
        status: { $nin: ["Delivered", "Canceled", "Refunded"] }
      }).populate("products.product");

      return {
        success: true,
        status: 200,
        orders
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
   * Get all completed orders
   * @returns {Object} - Completed orders or error
   */
  async getCompletedOrders() {
    try {
      const orders = await Order.find({
        $or: [{ status: "Delivered" }]
      }).populate("products.product");

      return {
        success: true,
        status: 200,
        orders
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
   * Get all canceled orders
   * @returns {Object} - Canceled orders or error
   */
  async getCanceledOrders() {
    try {
      const orders = await Order.find({
        $or: [{ status: "Canceled" }, { status: "Refunded" }]
      }).populate("products.product");

      return {
        success: true,
        status: 200,
        orders
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
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Object} - Creation result
   */
  async createOrder(orderData) {
    try {
      // Validate required fields
      const requiredFields = ['userId', 'products', 'deliveryInfo', 'total', 'paymentId'];
      const missingFields = requiredFields.filter(field => !orderData[field]);
      
      if (missingFields.length > 0) {
        return {
          success: false,
          status: 400,
          message: "All fields are required"
        };
      }

      // Create a new order
      const newOrder = {
        userId: orderData.userId,
        products: orderData.products.map((product) => ({
          product: product.product,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          color: product.color,
          size: product.size,
        })),
        deliveryInfo: orderData.deliveryInfo,
        total: orderData.total,
        paymentId: orderData.paymentId,
      };

      const order = await Order.create(newOrder);

      return {
        success: true,
        status: 201,
        order
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
   * Get monthly orders
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Object} - Monthly orders or error
   */
  async getMonthlyOrders(month, year) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const orderReport = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
      ]);

      return {
        success: true,
        status: 200,
        orders: orderReport
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
   * Get orders by user ID
   * @param {string} userId - User ID
   * @returns {Object} - User orders or error
   */
  async getOrdersByUserId(userId) {
    try {
      const orders = await Order.find({ userId: userId });

      return {
        success: true,
        status: 200,
        orders
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
   * Update order
   * @param {string} orderId - Order ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Update result
   */
  async updateOrder(orderId, updateData) {
    try {
      const result = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

      if (!result) {
        return {
          success: false,
          status: 400,
          message: "Order not found"
        };
      }

      return {
        success: true,
        status: 200,
        message: "Order updated successfully",
        order: result
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

export default new OrderService();
