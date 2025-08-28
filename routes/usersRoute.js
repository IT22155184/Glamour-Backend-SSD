import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Route for creating a new user
router.post("/", userController.createUser);

// Route for updating user details (email, phone number, and password)
router.put("/:id", userController.updateUser);

// Route for deleting a user by ID
router.delete("/:id", userController.deleteUser);

export default router;
