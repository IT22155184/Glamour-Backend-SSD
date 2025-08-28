import express from "express";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

//Route for add payment
router.post("/", paymentController.addPayment);

//Route for get payment
router.get("/:id", paymentController.getPayment);

export default router;
