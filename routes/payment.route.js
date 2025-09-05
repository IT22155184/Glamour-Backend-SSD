import express from "express";
import paymentController from "../controllers/payment.controller.js";
import {
  paymentInputValidation,
  handleValidationErrors,
  sanitizePaymentContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";

const router = express.Router();

//Route for add payment
router.post(
  "/",
  sanitizeInput,
  paymentInputValidation,
  handleValidationErrors,
  sanitizePaymentContent,
  paymentController.createPayment
);

//Route for get payment
router.get("/:id", sanitizeInput, paymentController.getPaymentById);

export default router;
