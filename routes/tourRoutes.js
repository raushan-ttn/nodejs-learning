const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

// We can also use destructuring.
// const { getTours, createTour, getSingleTour } = require("./../controllers/tourController");

const router = express.Router(); // create a new route and save in tourRouter variable.

// Nested Route.

// Example of Nested Tours.
// POST /tour/wer23322/reviews
// GET /tour/ee332323/reviews
// GET /tour/asfds/reviews/asd21331
/*
    router.route('/:tourId/reviews')
      .get(authController.protectTours, reviewController.getAllReviews)
      .post(authController.protectTours, reviewController.createReview);

    router.route('/:tourId/reviews/:reviewId')
      .get(authController.protectTours, reviewController.getReview);
 */

router.use('/:tourId/reviews', reviewRouter); // Re-route to review route.

// Note: just Like app.js, first '/api/v1/tours' route to this file and
// this file re-route review route.

// ==============================================================

// Each Router is mini sub application for each resource, so this will work only -
// for tours not for users. we can create middleware specific to params.

/*
    router.param('id',(req, res, next, val) => {
      console.log(`Middleware Specific to Id: ${val}`);
      next();
    });
*/

// We can also create middleware in controller and call here.

// router.param("id",tourController.checkId);

router.route('/top-5-tours').get(tourController.aliasTopFive, tourController.getTours);
router.route('/tour-stats').get(tourController.getToursStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.use(authController.protectTours);

// Note in express we have route method to combine similar route togather.

router
  .route('/')
  .get(tourController.getTours) // only for loggedin users.
  .post(tourController.createTour);
// .post(tourController.checkBody, tourController.createTour);
// we can pass specific middleWare to route, validate something before call API.

// Note: First "checkBody" will call then "createTour" handler will call. So we can do anything -
// before handler call.

router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(
    // authController.protectTours, // First check user login(MIDDLEWARE ADDED BEFORE)
    authController.ristrictTo('admin', 'lead-guide'), // check role ristriction on route.
    tourController.deleteTour,
  );

module.exports = router;
