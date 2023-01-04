const fs = require('fs');

//##### ROUTE HANDLER ##########

// Note when we call API event loop is working from app.get, so that we can read file at top, because its read once for all request.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getTours = (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      requestTime: req.requestTime,
      result: tours.length,
      data: {
        // tours: tours  // In ES6 do not need to specify key and value at the same name.
        tours,
      }
    });
};

// Get tour based on parameter id.

// app.get("/nitours/v1/tours/:id/:x/:y?", (req, res) => {

// Note: we can define n number of parameters in URL, by default all params are mendatory. add/suffix  question mark (?) to make
// it as optional.
exports.getSingleTour = (req, res) => {
  console.log(req.params); // to get all parameter, param return all params as object.
  const id = req.params.id * 1; // this is nice trick to convert string to number. Here req.param.id is string and converted in num.
  const tour = tours.find(el => el.id === id);

  // if(id > tours.length){
  // if(typeof tour === 'undefined'){
  if (!tour) {
    res.status(404)
      .json({ status: "fail", message: "InValid ID" });
  }

  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: {
        tour
      }
    });
};


// To modify request data we need to use middleware. and need to define at top.
exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // this will merge two object.

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "SUCCESS",
      data: {
        tour: tours,
      }
    })
  });
  // Note: status code 201 for created
};

// Update request.
exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404)
      .json({ status: "fail", message: "InValid ID" });
  }

  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: {
        tour: "Updated data" // Just for placeholder, no need to build whole logic here.
      }
    });
};


// delete request.
exports.deleteTour = (req, res) => {

  if (req.params.id * 1 > tours.length) {
    res.status(404)
      .json({ status: "fail", message: "InValid ID" });
  }

  res
    .status(204)
    .json({
      status: "SUCCESS",
      data: null
    });
};

