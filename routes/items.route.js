import express from "express";
import itemController from "../controllers/item.controller.js";

const router = express.Router();

// Get trending items
router.get("/trending", itemController.getTrendingItems);

// Create item
router.post("/", itemController.createItem);

// Get all items
router.get("/", itemController.getAllItems);

// Get item by id
router.get("/:id", itemController.getItemById);

// Update item
router.put("/:id", itemController.updateItem);

// Delete item
router.delete("/:id", itemController.deleteItem);

export default router;