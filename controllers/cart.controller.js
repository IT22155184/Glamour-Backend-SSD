import cartService from "../services/cart.service.js";

class CartController {
  /**
   * Remove item from cart
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async removeItemFromCart(req, res) {
    try {
      const { userId, id } = req.params;
      const result = await cartService.removeItemFromCart(userId, id);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Remove item from cart error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Decrease item quantity in cart
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async decreaseItemQuantity(req, res) {
    try {
      const { userId, id } = req.params;
      const result = await cartService.decreaseItemQuantity(userId, id);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Decrease item quantity error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Increase item quantity in cart
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async increaseItemQuantity(req, res) {
    try {
      const { userId, id, productId } = req.params;
      const result = await cartService.increaseItemQuantity(userId, id, productId);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Increase item quantity error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Add item to cart
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addItemToCart(req, res) {
    try {
      const { userId } = req.params;
      // Frontend sends { items: [ { product, quantity, color, size } ] }
      const firstItem = Array.isArray(req.body?.items) && req.body.items.length > 0
        ? req.body.items[0]
        : null;

      if (!firstItem) {
        return res.status(400).json({ message: "No items provided" });
      }

      const result = await cartService.addItemToCart(userId, firstItem);
      
      if (result.success) {
        return res.status(result.status).json(result.cart);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Add item to cart error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Get cart for user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCartByUserId(req, res) {
    try {
      const { userId } = req.params;
      const result = await cartService.getCartByUserId(userId);
      
      if (result.success) {
        return res.status(result.status).json(result.cartItems);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Get cart by user ID error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Clear all items from cart
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async clearCart(req, res) {
    try {
      const { userId } = req.params;
      const result = await cartService.clearCart(userId);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Clear cart error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new CartController();
