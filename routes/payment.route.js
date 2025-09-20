import express from "express";
import paymentController from "../controllers/payment.controller.js";
import {
  paymentInputValidation,
  handleValidationErrors,
  sanitizePaymentContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";
import {
  authenticateToken,
  requireCustomer,
} from "../middleware/auth.middleware.js";

const router = express.Router();

//Route for add payment
router.post(
  "/",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  paymentInputValidation,
  handleValidationErrors,
  sanitizePaymentContent,
  paymentController.createPayment
);

//Route for get payment
router.get("/:id", sanitizeInput, paymentController.getPaymentById);

export default router;
