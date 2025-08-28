import reviewService from "../services/review.service.js";

class ReviewController {
  /**
   * Add a new review to an item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addReview(req, res) {
    try {
      const { id } = req.params;
      const result = await reviewService.addReview(id, req.body);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error adding review:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get all reviews for an item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getReviews(req, res) {
    try {
      const { id } = req.params;
      const result = await reviewService.getReviews(id);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Update an existing review
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateReview(req, res) {
    try {
      const { id, reviewId } = req.params;
      const result = await reviewService.updateReview(id, reviewId, req.body);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Delete a review
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteReview(req, res) {
    try {
      const { id, reviewId } = req.params;
      const result = await reviewService.deleteReview(id, reviewId);
      
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get a specific review by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getReviewById(req, res) {
    try {
      const { id, reviewId } = req.params;
      const result = await reviewService.getReviewById(id, reviewId);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching review by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get reviews by user ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getReviewsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const result = await reviewService.getReviewsByUserId(userId);
      
      return res.status(result.status).json(result.data || { message: result.message });
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new ReviewController();
