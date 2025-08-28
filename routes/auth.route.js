import express from "express";
import authController from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Unified authentication routes
router.post("/verify", authController.verifyToken);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authenticateToken, authController.logout);
router.post("/logout-all", authenticateToken, authController.logoutAll);
router.get("/profile", authenticateToken, authController.getProfile);

export default router;
