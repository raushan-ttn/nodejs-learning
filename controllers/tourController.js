//const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

//##### ROUTE HANDLER ##########

// Note when we call API event loop is working from app.get, so that we can read file at top,
// because its read once for all request.
/*
  const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
  );
 */
// MiddleWare created to validate ID before Get/Update/Delete.

/*
  exports.checkId = (req, res, next, val) => {
    console.log(`Middleware Specific to Id: ${val}`);
    if (req.params.id * 1 > tours.length) {
      // we must use return here, so that next will not call and api not send another response.
      return res.status(404)
        .json({ status: 'fail', message: 'InValid ID1' });
    }
    next();
  };
 */
// MiddleWare created to validate body before create data.
/*
  exports.checkBody = (req, res, next) => {
    console.log('Middleware Specific to body!!!');
    if (!req.body.name || !req.body.price) {
      return res.status(400)
        .json({ status: 'Fail', message: 'InValid body (Missing Name OR Price) !!!' });
    }
    next();
  };
*/
/*
  exports.getTours = (req, res) => {
    res
      .status(200)
      .json({
        status: 'SUCCESS',
        requestTime: req.requestTime,
        result: tours.length,
        data: {
          // tours: tours  // In ES6 do not need to specify key and value at the same name.
          tours,
        },
      });
  };
*/
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: 'fail',
      message: err,
    });
  }
};
// Get tour based on parameter id.

// app.get("/nitours/v1/tours/:id/:x/:y?", (req, res) => {

// Note: we can define n number of parameters in URL, by default all params are mendatory.
// add/suffix  question mark (?) to make
// it as optional.

/*
  exports.getSingleTour = (req, res) => {
    console.log(req.params); // to get all parameter, param return all params as object.
    const id = req.params.id * 1; // this is nice trick to convert string to number.
    const tour = tours.find((el) => el.id === id);

    // Middleware created to check ID.

    // if(id > tours.length){
    // if(typeof tour === 'undefined'){
    // if (!tour) {
    //   res.status(404)
    //     .json({ status: "fail", message: "InValid ID" });
    // }

    res
      .status(200)
      .json({
        status: 'SUCCESS',
        data: {
          tour,
        },
      });
  };
*/
exports.getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id});
    res
      .status(200)
      .json({
        status: 'success',
        data: {
          tour,
        },
      });
  } catch (err) {
    res
      .status(404)
      .json({
        status: 'fail',
        message: err,
      });
  }
};

/*
  // To modify request data we need to use middleware. and need to define at top.
  exports.createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body); // this will merge two object.

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      res.status(201).json({
        status: 'SUCCESS',
        data: {
          tour: tours,
        },
      });
    });
    // Note: status code 201 for created
  };
*/
exports.createTour = async (req, res) => {
  // console.log(req.body);
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'SUCCESS',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      // message: 'Invalid data Sent!!!',
      message: err,
    });
  }

  // Note: status code 201 for created
};

// Update request.
exports.updateTour = (req, res) => {
  // Middleware created to check ID.

  // if (req.params.id * 1 > tours.length) {
  //   res.status(404)
  //     .json({ status: "fail", message: "InValid ID" });
  // }

  res
    .status(200)
    .json({
      status: 'SUCCESS',
      data: {
        tour: 'Updated data', // Just for placeholder, no need to build whole logic here.
      },
    });
};

// delete request.
exports.deleteTour = (req, res) => {
  // Middleware created to check ID.

  // if (req.params.id * 1 > tours.length) {
  //   res.status(404)
  //     .json({ status: "fail", message: "InValid ID" });
  // }

  res
    .status(204)
    .json({
      status: 'SUCCESS',
      data: null,
    });
};
