import express from "express";
import cartController from "../controllers/cart.controller.js";
import {
  sanitizeInput,
  cartInputValidation,
  handleValidationErrors,
  sanitizeCartContent,
} from "../middleware/xss.middleware.js";

const router = express.Router();

// Delete cart items
router.put("/:userId/:id", sanitizeInput, cartController.removeItemFromCart);

// Update quantity of item in cart (decrease)
router.put(
  "/minus/:userId/:id",
  sanitizeInput,
  cartController.decreaseItemQuantity
);

// Update quantity of item in cart (increase)
router.put(
  "/plus/:userId/:id/:productId",
  sanitizeInput,
  cartController.increaseItemQuantity
);

// Add item to cart
router.post(
  "/:userId",
  sanitizeInput,
  cartInputValidation,
  handleValidationErrors,
  sanitizeCartContent,
  cartController.addItemToCart
);

// Get cart for user
router.get("/:userId", sanitizeInput, cartController.getCartByUserId);

// Delete all items in the cart for a given user
router.delete("/:userId", sanitizeInput, cartController.clearCart);

export default router;
