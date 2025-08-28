import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

// Route for creating a new user (customer or employee)
// Query parameter: ?userType=customer or ?userType=employee
router.post("/", userController.createUser);

// Route for updating user details
// Query parameter: ?userType=customer or ?userType=employee
router.put("/:id", userController.updateUser);

// Route for deleting a user by ID
// Query parameter: ?userType=customer or ?userType=employee
router.delete("/:id", userController.deleteUser);

// Route for getting all users
// Query parameter: ?userType=customer or ?userType=employee or ?userType=all
router.get("/", userController.getAllUsers);

// Route for getting user by ID
// Query parameter: ?userType=customer or ?userType=employee
router.get("/:id", userController.getUserById);

// Route for getting user by email
// Query parameter: ?userType=customer or ?userType=employee
router.get("/email/:email", userController.getUserByEmail);

// Route for updating user password
// Query parameter: ?userType=customer or ?userType=employee
router.put("/:id/password", userController.updateUserPassword);

export default router;
