import { Item } from "../models/itemsModel.js";

class ReviewService {
  /**
   * Validate review data
   * @param {Object} reviewData - Review data to validate
   * @returns {Object} Validation result
   */
  validateReviewData(reviewData) {
    const { userId, userName, rating, reviewComment } = reviewData;
    
    if (!userId || !userName || !rating || !reviewComment) {
      return {
        isValid: false,
        message: 'All fields are required: userId, userName, rating, reviewComment'
      };
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return {
        isValid: false,
        message: 'Rating must be a number between 1 and 5'
      };
    }

    return { isValid: true };
  }

  /**
   * Add a new review to an item
   * @param {string} itemId - Item ID
   * @param {Object} reviewData - Review data
   * @returns {Object} Response object with status and data
   */
  async addReview(itemId, reviewData) {
    try {
      // Validate review data
      const validation = this.validateReviewData(reviewData);
      if (!validation.isValid) {
        return { status: 400, message: validation.message };
      }

      // Find the item
      const item = await Item.findById(itemId);
      if (!item) {
        return { status: 404, message: 'Item not found' };
      }

      // Check if user has already reviewed this item
      const existingReview = item.reviews.find(review => review.userId === reviewData.userId);
      if (existingReview) {
        return { status: 400, message: 'User has already reviewed this item' };
      }

      // Add the review
      const newReview = {
        userId: reviewData.userId,
        userName: reviewData.userName,
        rating: reviewData.rating,
        reviewComment: reviewData.reviewComment,
        createdAt: new Date()
      };

      item.reviews.push(newReview);
      const updatedItem = await item.save();

      return { status: 201, data: updatedItem };
    } catch (error) {
      console.error('Error in addReview service:', error);
      throw error;
    }
  }

  /**
   * Get all reviews for an item
   * @param {string} itemId - Item ID
   * @returns {Object} Response object with status and data
   */
  async getReviews(itemId) {
    try {
      const item = await Item.findById(itemId);
      if (!item) {
        return { status: 404, message: 'Item not found' };
      }

      // Sort reviews by creation date (newest first)
      const sortedReviews = item.reviews.sort((a, b) => 
        new Date(b.createdAt || b._id.getTimestamp()) - new Date(a.createdAt || a._id.getTimestamp())
      );

      return { status: 200, data: sortedReviews };
    } catch (error) {
      console.error('Error in getReviews service:', error);
      throw error;
    }
  }

  /**
   * Update an existing review
   * @param {string} itemId - Item ID
   * @param {string} reviewId - Review ID
   * @param {Object} updateData - Updated review data
   * @returns {Object} Response object with status and message
   */
  async updateReview(itemId, reviewId, updateData) {
    try {
      // Validate update data
      const validation = this.validateReviewData(updateData);
      if (!validation.isValid) {
        return { status: 400, message: validation.message };
      }

      // Find the item
      const item = await Item.findById(itemId);
      if (!item) {
        return { status: 404, message: 'Item not found' };
      }

      // Find the review
      const review = item.reviews.id(reviewId);
      if (!review) {
        return { status: 404, message: 'Review not found' };
      }

      // Check if the user owns this review
      if (review.userId !== updateData.userId) {
        return { status: 403, message: 'You can only update your own reviews' };
      }

      // Update the review
      review.userName = updateData.userName;
      review.rating = updateData.rating;
      review.reviewComment = updateData.reviewComment;
      review.updatedAt = new Date();

      await item.save();

      return { status: 200, message: 'Review updated successfully' };
    } catch (error) {
      console.error('Error in updateReview service:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   * @param {string} itemId - Item ID
   * @param {string} reviewId - Review ID
   * @returns {Object} Response object with status and message
   */
  async deleteReview(itemId, reviewId) {
    try {
      const result = await Item.updateOne(
        { _id: itemId },
        { $pull: { reviews: { _id: reviewId } } }
      );

      if (result.modifiedCount === 0) {
        return { status: 404, message: 'Review not found or item not found' };
      }

      return { status: 200, message: 'Review deleted successfully' };
    } catch (error) {
      console.error('Error in deleteReview service:', error);
      throw error;
    }
  }

  /**
   * Get a specific review by ID
   * @param {string} itemId - Item ID
   * @param {string} reviewId - Review ID
   * @returns {Object} Response object with status and data
   */
  async getReviewById(itemId, reviewId) {
    try {
      const item = await Item.findById(itemId);
      if (!item) {
        return { status: 404, message: 'Item not found' };
      }

      const review = item.reviews.id(reviewId);
      if (!review) {
        return { status: 404, message: 'Review not found' };
      }

      return { status: 200, data: review };
    } catch (error) {
      console.error('Error in getReviewById service:', error);
      throw error;
    }
  }

  /**
   * Get all reviews by a specific user
   * @param {string} userId - User ID
   * @returns {Object} Response object with status and data
   */
  async getReviewsByUserId(userId) {
    try {
      const items = await Item.find(
        { 'reviews.userId': userId },
        { 'reviews.$': 1, name: 1, productId: 1 }
      );

      if (!items || items.length === 0) {
        return { status: 404, message: 'No reviews found for this user' };
      }

      const userReviews = items.map(item => ({
        itemId: item._id,
        itemName: item.name,
        productId: item.productId,
        review: item.reviews[0] // Since we're using positional operator, this will be the matching review
      }));

      return { status: 200, data: userReviews };
    } catch (error) {
      console.error('Error in getReviewsByUserId service:', error);
      throw error;
    }
  }

  /**
   * Get review statistics for an item
   * @param {string} itemId - Item ID
   * @returns {Object} Response object with status and data
   */
  async getReviewStatistics(itemId) {
    try {
      const item = await Item.findById(itemId);
      if (!item) {
        return { status: 404, message: 'Item not found' };
      }

      const reviews = item.reviews;
      if (reviews.length === 0) {
        return { 
          status: 200, 
          data: {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          }
        };
      }

      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;

      const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

      return {
        status: 200,
        data: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          ratingDistribution
        }
      };
    } catch (error) {
      console.error('Error in getReviewStatistics service:', error);
      throw error;
    }
  }
}

export default new ReviewService();
