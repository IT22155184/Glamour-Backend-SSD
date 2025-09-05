import express from "express";
import itemController from "../controllers/item.controller.js";
import {
  itemInputValidation,
  handleValidationErrors,
  sanitizeItemContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";

const router = express.Router();

// Get trending items
router.get("/trending", itemController.getTrendingItems);

// Create item
router.post(
  "/",
  authenticateToken ,
  sanitizeInput,
  requireEmployee,
  itemInputValidation,
  handleValidationErrors,
  sanitizeItemContent,
  itemController.createItem
);

// Get all items
router.get("/", itemController.getAllItems);

// Get item by id
router.get("/:id", sanitizeInput, itemController.getItemById);

// Update item
router.put(
  "/:id",
  authenticateToken,
  requireEmployee,
  sanitizeInput,
  itemInputValidation,
  handleValidationErrors,
  sanitizeItemContent,
  itemController.updateItem
);

// Delete item
router.delete("/:id", sanitizeInput, itemController.deleteItem);

export default router;
