const express = require('express');
const tourController = require('../controllers/tourController');
// We can also use destructuring.
// const { getTours, createTour, getSingleTour, updateTour, deleteTour } = require("./../controllers/tourController");

const router = express.Router(); // create a new route and save in tourRouter variable.

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

// Note in express we have route method to combine similar route togather.

router
  .route('/')
  .get(tourController.getTours)
  .post(tourController.createTour);
// .post(tourController.checkBody, tourController.createTour);
// we can pass specific middleWare to route, validate something before call API.

// Note: First "checkBody" will call then "createTour" handler will call. So we can do anything -
// before handler call.

router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
