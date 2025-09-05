import express from "express";
import orderController from "../controllers/order.controller.js";
import {
  orderInputValidation,
  handleValidationErrors,
  sanitizeOrderContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";

const router = express.Router();

// Route to get all ongoing orders
router.get("/ongoing", orderController.getOngoingOrders);

// Route to get all completed orders
router.get("/completed", orderController.getCompletedOrders);

// Route to get all canceled orders
router.get("/canceled", orderController.getCanceledOrders);

// Route for add order
router.post(
  "/",
  sanitizeInput,
  orderInputValidation,
  handleValidationErrors,
  sanitizeOrderContent,
  orderController.createOrder
);

// Route to get all the order within a month
router.get("/monthly", orderController.getMonthlyOrders);

// Route for get order by user ID
router.get("/:userId", sanitizeInput, orderController.getOrdersByUserId);

// Route for update order
router.put("/:userId", sanitizeInput, orderController.updateOrder);

export default router;
