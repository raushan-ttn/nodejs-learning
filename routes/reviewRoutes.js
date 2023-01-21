const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

// To get all reviews of Specific Tour.
router.get('/tours/:tourId');

// To get all reviews of Specific User.
router.get('/Users/userId');

router.route('/')
  .get(authController.protectTours, reviewController.getAllReviews) // Only loggedIn Users
  .post(authController.protectTours, reviewController.createReview);

router.route('/:id')
  .get(authController.protectTours, reviewController.getReview)
  .patch(authController.protectTours, reviewController.updateReview)
  .delete(authController.protectTours, reviewController.deleteReview);

module.exports = router;
