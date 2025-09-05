import express from "express";
import userController from "../controllers/user.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
import {
  userInputValidation,
  handleValidationErrors,
  sanitizeUserContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";

const router = express.Router();

// Route for updating user details
// Query parameter: ?userType=customer or ?userType=employee
router.put(
  "/:id",
  authenticateToken,
  sanitizeInput,
  userInputValidation,
  handleValidationErrors,
  sanitizeUserContent,
  userController.updateUser
);

// Route for deleting a user by ID
// Query parameter: ?userType=customer or ?userType=employee
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["employee"]),
  sanitizeInput,
  userController.deleteUser
);

// Route for getting all users (employees only)
// Query parameter: ?userType=customer or ?userType=employee or ?userType=all
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["employee"]),
  userController.getAllUsers
);

// Route for getting user by ID
// Query parameter: ?userType=customer or ?userType=employee
router.get(
  "/:id",
  authenticateToken,
  sanitizeInput,
  userController.getUserById
);

// Route for getting user by email (employees only)
// Query parameter: ?userType=customer or ?userType=employee
router.get(
  "/email/:email",
  authenticateToken,
  authorizeRoles(["employee"]),
  sanitizeInput,
  userController.getUserByEmail
);

// Route for updating user password
// Query parameter: ?userType=customer or ?userType=employee
router.put(
  "/:id/password",
  authenticateToken,
  sanitizeInput,
  userController.updateUserPassword
);

export default router;
