import express from "express";
import reviewController from "../controllers/review.controller.js";
import {
  reviewInputValidation,
  handleValidationErrors,
  sanitizeReviewContent,
  sanitizeInput,
} from "../middleware/xss.middleware.js";

const router = express.Router();

// Add a review
router.post(
  "/:id",
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
  sanitizeInput,
  reviewInputValidation,
  handleValidationErrors,
  sanitizeReviewContent,
  reviewController.updateReview
);

// Delete a review
router.delete("/:id/:reviewId", sanitizeInput, reviewController.deleteReview);

// Get a specific review by ID
router.get("/:id/:reviewId", sanitizeInput, reviewController.getReviewById);

// Get reviews by user ID
router.get("/user/:userId", sanitizeInput, reviewController.getReviewsByUserId);

export default router;
