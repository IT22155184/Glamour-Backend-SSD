import express from "express";
import { body } from "express-validator";
import authController from "../controllers/auth.controller.js";
import userController from "../controllers/user.controller.js";
import passport from "../config/passport.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  sanitizeInput,
  loginInputValidation,
  tokenInputValidation,
  userInputValidation,
  userRegistrationValidation,
  handleValidationErrors,
  sanitizeLoginContent,
  sanitizeUserContent,
} from "../middleware/xss.middleware.js";

const router = express.Router();

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleOAuthCallback
);

// Unified authentication routes
router.post(
  "/verify",
  sanitizeInput,
  tokenInputValidation,
  handleValidationErrors,
  authController.verifyToken
);
router.post(
  "/login",
  sanitizeInput,
  loginInputValidation,
  handleValidationErrors,
  sanitizeLoginContent,
  authController.login
);
// Route for user registration
// Query parameter: ?userType=customer or ?userType=employee
router.post(
  "/register",
  sanitizeInput,
  userRegistrationValidation,
  handleValidationErrors,
  sanitizeUserContent,
  userController.createUser
);
router.post(
  "/refresh",
  sanitizeInput,
  [
    body("refreshToken")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Refresh token is required"),
  ],
  handleValidationErrors,
  authController.refreshToken
);
router.post(
  "/logout",
  authenticateToken,
  sanitizeInput,
  [
    body("refreshToken")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Refresh token is required"),
  ],
  handleValidationErrors,
  authController.logout
);
router.post("/logout-all", authenticateToken, authController.logoutAll);
router.get("/profile", authenticateToken, authController.getProfile);

export default router;
