import express from "express";
import bodyMeasurementController from "../controllers/bodyMeasurement.controller.js";
import {
  sanitizeInput,
  bodyMeasurementValidation,
  bodyMeasurementCreateValidation,
  bodyMeasurementUpdateValidation,
  handleValidationErrors,
} from "../middleware/xss.middleware.js";
import {
  authenticateToken,
  requireEmployee,
  requireCustomer,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to retrieve model sizes details within a date range
router.get(
  "/range",
  sanitizeInput,
  bodyMeasurementController.getMeasurementsByDateRange
);

// Save new body measurement
router.post(
  "/",
  sanitizeInput,
  bodyMeasurementCreateValidation,
  handleValidationErrors,
  bodyMeasurementController.createMeasurement
);

// Update a body measurement
router.put(
  "/:id",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  bodyMeasurementUpdateValidation,
  handleValidationErrors,
  bodyMeasurementController.updateMeasurement
);

// Route for Get All Measurements from database
router.get(
  "/",
  authenticateToken,
  requireEmployee,
  bodyMeasurementController.getAllMeasurements
);

// Route for Get One Measurement from database by id
router.get(
  "/:id",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  bodyMeasurementController.getMeasurementById
);

// Route to get measurement by userID (using MeasurementID)
router.get(
  "/user/:userID",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  bodyMeasurementController.getMeasurementByUserId
);

// Route for delete a Measurement
router.delete(
  "/:id",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  bodyMeasurementController.deleteMeasurement
);

export default router;
