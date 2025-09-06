import express from "express";
import deliveryInfoController from "../controllers/deliveryInfo.controller.js";
import {
  userInputValidation,
  handleValidationErrors,
  sanitizeUserContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";
import {
  authenticateToken,
  requireEmployee,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Route for add delivery info
router.post(
  "/:userId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  userInputValidation,
  handleValidationErrors,
  sanitizeUserContent,
  deliveryInfoController.addDeliveryInfo
);

// Route for get delivery info by delivery ID
router.get(
  "/delivery/:deliveryId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  deliveryInfoController.getDeliveryInfoById
);

// Route for get delivery info by user ID
router.get(
  "/:userId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  deliveryInfoController.getDeliveryInfoByUserId
);

// Route for update delivery info
router.put(
  "/:id",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  userInputValidation,
  handleValidationErrors,
  sanitizeUserContent,
  deliveryInfoController.updateDeliveryInfo
);

// Route for delete delivery info
router.delete(
  "/:id",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  deliveryInfoController.deleteDeliveryInfo
);

// Route for get all delivery info (admin use)
router.get(
  "/",
  authenticateToken,
  requireEmployee,
  deliveryInfoController.getAllDeliveryInfo
);

// Route for get delivery info by district
router.get(
  "/district/:district",
  sanitizeInput,
  deliveryInfoController.getDeliveryInfoByDistrict
);

export default router;
