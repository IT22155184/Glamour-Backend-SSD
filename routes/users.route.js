import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route for creating a new user (customer or employee)
// Query parameter: ?userType=customer or ?userType=employee
router.post("/", userController.createUser);

// Route for updating user details
// Query parameter: ?userType=customer or ?userType=employee
router.put("/:id", authenticateToken, userController.updateUser);

// Route for deleting a user by ID
// Query parameter: ?userType=customer or ?userType=employee
router.delete("/:id", authenticateToken, authorizeRoles(['employee']), userController.deleteUser);

// Route for getting all users (employees only)
// Query parameter: ?userType=customer or ?userType=employee or ?userType=all
router.get("/", authenticateToken, authorizeRoles(['employee']), userController.getAllUsers);

// Route for getting user by ID
// Query parameter: ?userType=customer or ?userType=employee
router.get("/:id", authenticateToken, userController.getUserById);

// Route for getting user by email (employees only)
// Query parameter: ?userType=customer or ?userType=employee
router.get("/email/:email", authenticateToken, authorizeRoles(['employee']), userController.getUserByEmail);

// Route for updating user password
// Query parameter: ?userType=customer or ?userType=employee
router.put("/:id/password", authenticateToken, userController.updateUserPassword);

export default router;
