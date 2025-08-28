import paymentService from "../services/payment.service.js";

class PaymentController {
  /**
   * Create a new payment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createPayment(req, res) {
    try {
      const result = await paymentService.createPayment(req.body);
      
      if (result.success) {
        return res.status(result.status).json(result.payment);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Create payment error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get payment by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const result = await paymentService.getPaymentById(id);
      
      if (result.success) {
        return res.status(result.status).json(result.payment);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get payment by ID error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new PaymentController();
