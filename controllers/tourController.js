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
    // BUILD QUERY.
    // ADD FILTER in query.
    //console.log(req.query); // Output: { duration: '5', difficulty: 'easy' }
    // NORMAL WAY, Without mongoose.
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => { delete queryObj[el]; });
    // console.log(queryObj);
    console.log(queryObj);

    // const query = Tour.find(queryObj); // find method return query, so that -
    // We can not apply below mongoose method (sort, limit, where, lte, lt) directly on query.

    // ANother way, Mongoose Method.
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // ADVANCE FILTER
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const query = Tour.find(JSON.parse(queryStr));
    // Params: /nitours/v1/tours?duration[gte]=5&difficulty=easy&page=1&price[lt]=1500
    // { duration: { gte: '5' }, difficulty: 'easy' }

    // EXECUTE Query.
    const tours = await query; // here query executes and return promise.

    // SEND Response.
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
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
exports.updateTour = async (req, res) => {
  // Middleware created to check ID.
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // pass some optional argument as per mongoose.
      runValidators: true,
    });

    res
      .status(200)
      .json({
        status: 'success',
        data: {
          tour, // As per ES-6: property name has the same name of the value.
        },
      });
  } catch (err) {
    res
      .status(400)
      .json({
        status: 'fail',
        message: err,
      });
  }
};

// delete request.
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res
      .status(204)
      .json({
        status: 'SUCCESS',
        data: null,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'fail',
        message: err,
      });
  }
};
