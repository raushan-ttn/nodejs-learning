const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Get all reviews.
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const allReviews = await Review.find(filter);
  if (!allReviews) {
    return next(new AppError('No Reviews found', 400));
  }
  res.status(200).json({
    status: 'success',
    results: allReviews.length,
    data: {
      allReviews,
    },
  });
});

// Get single review.
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No Reviews found', 400));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// Create Review.
exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId; // Get tourId from url.
  if (!req.body.user) req.body.user = req.user.id; // Get login user

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'SUCCESS',
    data: {
      review: newReview,
    },
  });
});

// Update Review.
exports.updateReview = factory.updateOne(Review);
// Delete Review
exports.deleteReview = factory.deleteOne(Review);
