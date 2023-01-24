const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // merge all parameters.

// Basically each route get access those params where it start from just like
// review route start from '/reviews' then it will not access before like '/:tourId/reviews'
// So that case we need to use {mergeParams: true} to get all parameter under review route.

// Example of Nested Tours.
// POST /tour/wer23322/reviews

// That's a nice little trick in order to protect all of the routes at the same time,-
// typically by using a middleware that comes before all these other routes.

// Protect all routes after this middleware.
router.use(authController.protectTours);

router.route('/')
  .get(reviewController.getAllReviews) // Only loggedIn Users
  .post(
    reviewController.setUserTourIds,
    reviewController.createReview,
  );

router.route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
