import express from "express";
import bodyMeasurementController from "../controllers/bodyMeasurement.controller.js";

const router = express.Router();

// Route to retrieve model sizes details within a date range
router.get('/range', bodyMeasurementController.getMeasurementsByDateRange);

// Save new body measurement
router.post('/', bodyMeasurementController.createMeasurement);

// Update a body measurement
router.put('/:id', bodyMeasurementController.updateMeasurement);

// Route for Get All Measurements from database
router.get('/', bodyMeasurementController.getAllMeasurements);

// Route for Get One Measurement from database by id
router.get('/:id', bodyMeasurementController.getMeasurementById);

// Route to get measurement by userID (using MeasurementID)
router.get('/user/:userID', bodyMeasurementController.getMeasurementByUserId);

// Route for delete a Measurement
router.delete('/:id', bodyMeasurementController.deleteMeasurement);

export default router;