import { Cart } from "../models/cartModel.js";
import { Item } from "../models/itemsModel.js";
import { Order } from "../models/orderModel.js";

class CartService {
  /**
   * Remove item from cart
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID to remove
   * @returns {Object} - Removal result
   */
  async removeItemFromCart(userId, itemId) {
    try {
      let cart = await Cart.findOne({ userId: userId });

      if (!cart) {
        return {
          success: false,
          status: 404,
          message: "Cart not found."
        };
      }

      let result = await Cart.updateOne(
        { userId: userId },
        { $pull: { items: { _id: itemId } } }
      );

      if (!result.nModified) {
        return {
          success: false,
          status: 404,
          message: "Item not found"
        };
      }

      return {
        success: true,
        status: 200,
        message: "Cart updated successfully"
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
   * Decrease item quantity in cart
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID
   * @returns {Object} - Update result
   */
  async decreaseItemQuantity(userId, itemId) {
    try {
      let cart = await Cart.findOne({ userId: userId });

      if (!cart) {
        return {
          success: false,
          status: 404,
          message: "Cart not found."
        };
      }

      let itemIndex = cart.items.findIndex((p) => p._id == itemId);

      if (itemIndex !== -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity = productItem.quantity - 1;
        cart.items[itemIndex] = productItem;
      } else {
        return {
          success: false,
          status: 404,
          message: "Product not found in cart."
        };
      }

      await cart.save();

      return {
        success: true,
        status: 200,
        message: "Quantity updated successfully."
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
   * Increase item quantity in cart
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID
   * @param {string} productId - Product ID
   * @returns {Object} - Update result
   */
  async increaseItemQuantity(userId, itemId, productId) {
    try {
      let cart = await Cart.findOne({ userId: userId });
      let item = await Item.findOne({ _id: productId });

      if (!item) {
        return {
          success: false,
          status: 400,
          message: "Item not found"
        };
      }

      if (!cart) {
        return {
          success: false,
          status: 404,
          message: "Cart not found."
        };
      }

      let itemIndex = cart.items.findIndex((p) => p._id == itemId);

      if (item.stock < cart.items[itemIndex].quantity + 1) {
        return {
          success: false,
          status: 400,
          message: "Quantity not available"
        };
      }

      if (5 < cart.items[itemIndex].quantity + 1) {
        return {
          success: false,
          status: 400,
          message: "You can only buy 5 items"
        };
      }

      if (itemIndex !== -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity = productItem.quantity + 1;
        cart.items[itemIndex] = productItem;
      } else {
        return {
          success: false,
          status: 404,
          message: "Product not found in cart."
        };
      }

      await cart.save();

      return {
        success: true,
        status: 200,
        message: "Quantity updated successfully."
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
   * Add item to cart
   * @param {string} userId - User ID
   * @param {Object} itemData - Item data (product, quantity, color, size)
   * @returns {Object} - Addition result
   */
  async addItemToCart(userId, itemData) {
    try {
      const { product, quantity, color, size } = itemData;
      let cart = await Cart.findOne({ userId: userId });
      let item = await Item.findOne({ _id: product });

      if (!item) {
        return {
          success: false,
          status: 400,
          message: "Item not found"
        };
      }

      if (item.stock < quantity) {
        return {
          success: false,
          status: 400,
          message: "Quantity not available"
        };
      }

      // If cart exists for user
      if (cart) {
        let itemIndex = cart.items.findIndex(
          (p) => p.product == product && p.color == color && p.size == size
        );

        // Product exists in the cart, update the quantity
        if (itemIndex > -1) {
          let productItem = cart.items[itemIndex];
          productItem.quantity = Number(productItem.quantity) + Number(quantity);
          cart.items[itemIndex] = productItem;
        } else {
          cart.items.push({ product, quantity, color, size });
        }
        cart = await cart.save();
        return {
          success: true,
          status: 201,
          cart
        };
      } else {
        // No cart for user, create new cart
        const newCart = await Cart.create({
          userId: userId,
          items: [{ product, quantity, color, size }],
        });
        return {
          success: true,
          status: 201,
          cart: newCart
        };
      }
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
   * Get cart for user with dynamic pricing
   * @param {string} userId - User ID
   * @returns {Object} - Cart data or error
   */
  async getCartByUserId(userId) {
    try {
      const cart = await Cart.findOne({ userId: userId }).populate("items.product");

      if (!cart) {
        return {
          success: false,
          status: 404,
          message: "Cart not found"
        };
      }

      const startDate = new Date();
      const endDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const cartitemsWithPriceChanged = await Promise.all(
        cart.items.map(async (item) => {
          const sales = await Order.aggregate([
            { $unwind: "$products" },
            {
              $match: {
                "products.productId": item.product.productId,
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
          const priceChanged =
            item.product.priceincrease *
            (totalQuantity / item.product.salesdifference);
          const price = item.product.minprice + priceChanged;
          
          if (price > item.product.maxprice) {
            item.product.minprice = item.product.maxprice;
          } else {
            item.product.minprice = price;
          }
          return item;
        })
      );

      return {
        success: true,
        status: 200,
        cartItems: cartitemsWithPriceChanged
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
   * Clear all items from cart
   * @param {string} userId - User ID
   * @returns {Object} - Clearing result
   */
  async clearCart(userId) {
    try {
      let cart = await Cart.findOne({ userId: userId });

      if (!cart) {
        return {
          success: false,
          status: 404,
          message: "Cart not found."
        };
      }

      cart.items = [];
      await cart.save();

      return {
        success: true,
        status: 200,
        message: "Cart cleared successfully."
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

export default new CartService();
