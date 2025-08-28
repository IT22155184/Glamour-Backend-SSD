import orderService from "../services/order.service.js";

class OrderController {
  /**
   * Get all ongoing orders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getOngoingOrders(req, res) {
    try {
      const result = await orderService.getOngoingOrders();
      
      if (result.success) {
        return res.status(result.status).json(result.orders);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get ongoing orders error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get all completed orders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCompletedOrders(req, res) {
    try {
      const result = await orderService.getCompletedOrders();
      
      if (result.success) {
        return res.status(result.status).json(result.orders);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get completed orders error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get all canceled orders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCanceledOrders(req, res) {
    try {
      const result = await orderService.getCanceledOrders();
      
      if (result.success) {
        return res.status(result.status).json(result.orders);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get canceled orders error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Create a new order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createOrder(req, res) {
    try {
      const result = await orderService.createOrder(req.body);
      
      if (result.success) {
        return res.status(result.status).json(result.order);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Create order error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get monthly orders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMonthlyOrders(req, res) {
    try {
      const { month, year } = req.query;
      const result = await orderService.getMonthlyOrders(month, year);
      
      if (result.success) {
        return res.status(result.status).json(result.orders);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get monthly orders error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get orders by user ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getOrdersByUserId(req, res) {
    try {
      const { userId } = req.params;
      const result = await orderService.getOrdersByUserId(userId);
      
      if (result.success) {
        return res.status(result.status).json(result.orders);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get orders by user ID error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Update order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateOrder(req, res) {
    try {
      const { userId } = req.params; // Note: This should probably be orderId
      const result = await orderService.updateOrder(userId, req.body);
      
      return res.status(result.status).json({ 
        message: result.message,
        order: result.order 
      });
    } catch (error) {
      console.error("Update order error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new OrderController();
