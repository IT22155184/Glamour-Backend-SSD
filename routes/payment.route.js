import express from "express";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

//Route for add payment
router.post("/", paymentController.createPayment);

//Route for get payment
router.get("/:id", paymentController.getPaymentById);

export default router;
