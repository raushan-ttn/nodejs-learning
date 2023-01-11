//const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');

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

// Middleware create for aliasTopFive.
exports.aliasTopFive = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,summary,ratingsAverage';
  next();
};

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
    // 1A) ADD FILTER in query.
    //console.log(req.query); // Output: { duration: '5', difficulty: 'easy' }
    // NORMAL WAY, Without mongoose.
    /*
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'sort', 'fields'];
        excludedFields.forEach((el) => { delete queryObj[el]; });
        // console.log(queryObj);

        // const query = Tour.find(queryObj); // find method return query, so that -
        // We can not apply below mongoose method (sort, limit, where, lte, lt) directly on query.

        // ANother way, Mongoose Method.
        // const query = Tour.find()
        //   .where('duration')
        //   .equals(5)
        //   .where('difficulty')
        //   .equals('easy');

        // 1B) ADVANCE FILTER
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Tour.find(JSON.parse(queryStr));
     */

    // Params: /nitours/v1/tours?duration[gte]=5&difficulty=easy&page=1&price[lt]=1500
    // { duration: { gte: '5' }, difficulty: 'easy' }

    // 2) SORTING
    // Mongoose(Tour.find()) Or (Normal) Tour.find() both return query, so that mongoose method -
    // will work for both cases.

    // /nitours/v1/tours?sort=-price :  add minus before value to sort by desc.
    /*
        if (req.query.sort) {
          // multiple sort togather.
          const sortBy = req.query.sort.split(',').join(' ');
          query = query.sort(sortBy);
        } else {
          query = query.sort('-duration');
        }
     */
    // 3) Fields - select fields from documents.
    /*
        if (req.query.fields) {
          const fields = req.query.fields.split(',').join(' ');
          console.log(fields);
          query = query.select(fields);
        } else {
          query = query.select('-__v');
          // prefix minus (-) excludes this fields.
          // if we select/deselect 3 fields pass minus (-) for all not only one
          // (/nitours/v1/tours?fields=-price,-ratingsAverage,-name)
        }
   */
    // 4) Paginations
    /*
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;

        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);
    */

    let tourNumCount = 0;
    if (req.query.page || req.query.limit) {
      tourNumCount = await Tour.countDocuments();
      // if (skip > tourNumCount) throw new Error('Page not exists!!!');
    }

    // EXECUTE Query.
    /*
        const tours = await query; // here query executes and return promise.
        // query.sort().select().skip().limit()
   */
    const features = new ApiFeatures(Tour.find(), req.query)
      .filters()
      .sort()
      .limitFields()
      .pagination(); // create query
    const tours = await features.query; // here query executes and return promise.
    // SEND Response.
    res.status(200).json({
      status: 'success',
      totalResult: (tourNumCount > 0) ? tourNumCount : tours.length,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
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
      runValidators: true, // this will support schema validators in model.
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

// Aggregation pipeline: Matching and Grouping.

exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }, // kind of where conditions
      },
      {
        $group: {
          // _id: null,
          // _id: '$ratingsQuantity', // we can group based on fields.
          _id: { $toUpper: '$difficulty' }, // for upper case.
          numTours: { $sum: 1 }, // kind of fields to show in output group by '_id' fields.
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $sum: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: -1 }, // 1 for ASC and -1 for DESC
      },
      {
        $match: { _id: { $ne: 'EASY' } }, // Exculde EASY from difficulty.
      },
    ]);

    res
      .status(200)
      .json({
        status: 'SUCCESS',
        data: {
          stats,
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

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates', // startDate is array type and unwind expose all array value as seprate document.
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' }, // Add addtional fields in API.
      },
      {
        $project: {
          _id: 0, // Boolean, 0 = hide fields 1 = show field in API.
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12, // as similar as limit.
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
