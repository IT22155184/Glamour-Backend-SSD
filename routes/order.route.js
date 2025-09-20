import express from "express";
import orderController from "../controllers/order.controller.js";
import {
  orderInputValidation,
  handleValidationErrors,
  sanitizeOrderContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";
import {
  authenticateToken,
  requireEmployee,
  requireCustomer,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to get all ongoing orders
router.get(
  "/ongoing",
  authenticateToken,
  requireEmployee,
  orderController.getOngoingOrders
);

// Route to get all completed orders
router.get(
  "/completed",
  authenticateToken,
  requireEmployee,
  orderController.getCompletedOrders
);

// Route to get all canceled orders
router.get(
  "/canceled",
  authenticateToken,
  requireEmployee,
  orderController.getCanceledOrders
);

// Route for add order
router.post(
  "/",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  orderInputValidation,
  handleValidationErrors,
  sanitizeOrderContent,
  orderController.createOrder
);

// Route to get all the order within a month
router.get(
  "/monthly",
  authenticateToken,
  requireEmployee,
  orderController.getMonthlyOrders
);

// Route for get order by user ID
router.get(
  "/:userId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  orderController.getOrdersByUserId
);

// Route for update order
router.put("/:userId", sanitizeInput, orderController.updateOrder);

export default router;
