import express from "express";
import reviewController from "../controllers/review.controller.js";
import {
  reviewInputValidation,
  handleValidationErrors,
  sanitizeReviewContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";
import {
  authenticateToken,
  requireCustomer,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Add a review
router.post(
  "/:id",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  reviewInputValidation,
  handleValidationErrors,
  sanitizeReviewContent,
  reviewController.addReview
);

// Get all reviews for an item
router.get("/:id", sanitizeInput, reviewController.getReviews);

// Update a review
router.put(
  "/:id/:reviewId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  reviewInputValidation,
  handleValidationErrors,
  sanitizeReviewContent,
  reviewController.updateReview
);

// Delete a review
router.delete(
  "/:id/:reviewId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  reviewController.deleteReview
);

// Get a specific review by ID
router.get(
  "/:id/:reviewId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  reviewController.getReviewById
);

// Get reviews by user ID
router.get(
  "/user/:userId",
  authenticateToken,
  requireCustomer,
  sanitizeInput,
  reviewController.getReviewsByUserId
);

export default router;
