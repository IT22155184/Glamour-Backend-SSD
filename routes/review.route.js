import express from "express";
import { Item } from "../models/itemsModel.js";

const router = express.Router();

// Add a review
router.post("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    let item = await Item.findById({ _id: id });
    if (
      !request.body.userId ||
      !request.body.userName ||
      !request.body.rating ||
      !request.body.reviewComment
    ) {
      return response.status(400).send({ message: "Request body is missing" });
    }
    item.reviews.push({
      userId: request.body.userId,
      userName: request.body.userName,
      rating: request.body.rating,
      reviewComment: request.body.reviewComment,
    });
    item = await item.save();
    return response.status(201).send(item);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all reviews
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    let item = await Item.findById({ _id: id });
    if (!item) {
      return response.status(404).send({ message: "Item not found" });
    }
    return response.status(200).send(item.reviews);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update a review
router.put("/:id/:reviewId", async (request, response) => {
  try {
    const { id, reviewId } = request.params;
    let item = await Item.findById({ _id: id });
    if (!item) {
        return response.status(404).send({ message: "Item not found" });
      }
    let review = item.reviews.id(reviewId);
    if (!review) {
        return response.status(404).send({ message: "Review not found" });
      }
    if (
      !request.body.userId ||
      !request.body.userName ||
      !request.body.rating ||
      !request.body.reviewComment
    ) {
        return response.status(400).send({ message: "Request body is missing" });
    }
    review.userId = request.body.userId;
    review.userName = request.body.userName;
    review.rating = request.body.rating;
    review.reviewComment = request.body.reviewComment;
    await item.save();
    
    return response.status(200).send({ message: "Review updated successfilly" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete a review
router.delete("/:id/:reviewId", async (request, response) => {
  try {
    const { id, reviewId } = request.params;
    let result = await Item.updateOne(
      { _id: id },
      { $pull: { reviews: { _id: reviewId } } }
    );
    // if (!result.nModified) {
    //   return response.status(404).send({ message: "Review not found" });
    // }
    return response.status(200).send({ message: "Review deleted" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
