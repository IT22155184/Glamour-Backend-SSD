import express from "express";
import Joi from "joi";
import { User } from "../models/userModel.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

// Unified authentication routes
router.post("/verify", authController.verifyToken);
router.post("/login", authController.login);

export default router;
