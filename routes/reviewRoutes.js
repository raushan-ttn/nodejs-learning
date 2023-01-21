const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // merge all parameters.

// Basically each route get access those params where it start from just like
// review route start from '/reviews' then it will not access before like '/:tourId/reviews'
// So that case we need to use {mergeParams: true} to get all parameter under review route.

// Example of Nested Tours.
// POST /tour/wer23322/reviews

router.route('/')
  .get(authController.protectTours, reviewController.getAllReviews) // Only loggedIn Users
  .post(authController.protectTours, reviewController.createReview);

router.route('/:id')
  .get(authController.protectTours, reviewController.getReview)
  .patch(authController.protectTours, reviewController.updateReview)
  .delete(authController.protectTours, reviewController.deleteReview);

module.exports = router;
