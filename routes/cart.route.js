import express from "express";
import cartController from "../controllers/cart.controller.js";

const router = express.Router();

// Delete cart items
router.put("/:userId/:id", cartController.removeItemFromCart);

// Update quantity of item in cart (decrease)
router.put("/minus/:userId/:id", cartController.decreaseItemQuantity);

// Update quantity of item in cart (increase)
router.put("/plus/:userId/:id/:productId", cartController.increaseItemQuantity);

// Add item to cart
router.post("/:userId", cartController.addItemToCart);

// Get cart for user
router.get("/:userId", cartController.getCartByUserId);

// Delete all items in the cart for a given user
router.delete('/:userId', cartController.clearCart);

export default router;
