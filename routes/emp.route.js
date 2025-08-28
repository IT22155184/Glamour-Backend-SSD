import express from "express";
import empController from "../controllers/emp.controller.js";

const router = express.Router();

// Route for creating a new employee
router.post("/", empController.createEmployee);

// Route for updating employee details
router.put("/:id", empController.updateEmployee);

// Route for deleting an employee by ID
router.delete("/:id", empController.deleteEmployee);

// Route for getting all employees
router.get("/", empController.getAllEmployees);

// Route for getting employee by ID
router.get("/:id", empController.getEmployeeById);

// Route for getting employee by email
router.get("/email/:email", empController.getEmployeeByEmail);

// Route for updating employee password
router.put("/:id/password", empController.updateEmployeePassword);

// Route for searching employees
router.get("/search/query", empController.searchEmployees);

// Route for getting employees by role
router.get("/role/:role", empController.getEmployeesByRole);

// Route for getting employee statistics
router.get("/statistics/overview", empController.getEmployeeStatistics);

export default router;