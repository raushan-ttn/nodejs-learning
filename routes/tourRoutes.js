const express = require("express");
const tourController = require("./../controllers/tourController");
// We can also use destructuring.
// const { getTours, createTour, getSingleTour, updateTour, deleteTour } = require("./../controllers/tourController");


const router = express.Router(); // create a new route and save in tourRouter variable.

// Note in express we have route method to combine similar route togather.

router
  .route("/")
  .get(tourController.getTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
