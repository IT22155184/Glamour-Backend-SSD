import express from "express";
import bodyMeasurementController from "../controllers/bodyMeasurement.controller.js";
import {
  sanitizeInput,
  bodyMeasurementValidation,
  handleValidationErrors,
} from "../middleware/xss.middleware.js";

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
  bodyMeasurementValidation,
  handleValidationErrors,
  bodyMeasurementController.createMeasurement
);

// Update a body measurement
router.put(
  "/:id",
  sanitizeInput,
  bodyMeasurementValidation,
  handleValidationErrors,
  bodyMeasurementController.updateMeasurement
);

// Route for Get All Measurements from database
router.get("/", bodyMeasurementController.getAllMeasurements);

// Route for Get One Measurement from database by id
router.get("/:id", sanitizeInput, bodyMeasurementController.getMeasurementById);

// Route to get measurement by userID (using MeasurementID)
router.get(
  "/user/:userID",
  sanitizeInput,
  bodyMeasurementController.getMeasurementByUserId
);

// Route for delete a Measurement
router.delete(
  "/:id",
  sanitizeInput,
  bodyMeasurementController.deleteMeasurement
);

export default router;
