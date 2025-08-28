import express from "express";
import reviewController from "../controllers/review.controller.js";

const router = express.Router();

// Add a review
router.post("/:id", reviewController.addReview);

// Get all reviews for an item
router.get('/:id', reviewController.getReviews);

// Update a review
router.put("/:id/:reviewId", reviewController.updateReview);

// Delete a review
router.delete("/:id/:reviewId", reviewController.deleteReview);

// Get a specific review by ID
router.get("/:id/:reviewId", reviewController.getReviewById);

// Get reviews by user ID
router.get("/user/:userId", reviewController.getReviewsByUserId);

export default router;
