// Review controller - Handles user reviews and ratings
const Review = require('../models/Review');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { reviewedUserId, rating, comment } = req.body;

    // Validate required fields
    if (!reviewedUserId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user is trying to review themselves
    if (reviewedUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    // Create review
    const review = await Review.create({
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
      rating,
      comment
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name profilePhoto');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name profilePhoto')
      .sort({ createdAt: -1 });

    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = sum / reviews.length;
    }

    res.json({
      reviews,
      averageRating: averageRating.toFixed(1)
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

module.exports = {
  createReview,
  getUserReviews
};
