import express from "express";
import cartController from "../controllers/cart.controller.js";
import {
  sanitizeInput,
  cartInputValidation,
  handleValidationErrors,
  sanitizeCartContent,
} from "../middleware/xss.middleware.js";
import {
  authenticateToken,
  requireCustomer,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Delete cart items
router.put(
  "/:userId/:id",
  authenticateToken,
  // requireCustomer,
  sanitizeInput,
  cartController.removeItemFromCart
);

// Update quantity of item in cart (decrease)
router.put(
  "/minus/:userId/:id",
  authenticateToken,
  // requireCustomer,
  sanitizeInput,
  cartController.decreaseItemQuantity
);

// Update quantity of item in cart (increase)
router.put(
  "/plus/:userId/:id/:productId",
  authenticateToken,
  // requireCustomer,
  sanitizeInput,
  cartController.increaseItemQuantity
);

// Add item to cart
router.post(
  "/:userId",
  authenticateToken,
  // requireCustomer,
  sanitizeInput,
  cartInputValidation,
  handleValidationErrors,
  sanitizeCartContent,
  cartController.addItemToCart
);

// Get cart for user
router.get(
  "/:userId",
  authenticateToken,
  // requireCustomer,
  sanitizeInput,
  cartController.getCartByUserId
);

// Delete all items in the cart for a given user
router.delete(
  "/:userId",
  authenticateToken,
  // requireCustomer,
  sanitizeInput,
  cartController.clearCart
);

export default router;
