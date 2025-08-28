import express from "express";
import cusItemsController from "../controllers/cusItems.controller.js";

const router = express.Router();

// Get items by trending status with dynamic pricing
router.get("/trending", cusItemsController.getTrendingItems);

// Get all items with dynamic pricing
router.get("/", cusItemsController.getAllItems);

// Get item by id with dynamic pricing
router.get("/:id", cusItemsController.getItemById);

export default router;
