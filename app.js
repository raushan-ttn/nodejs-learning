const express = require("express");
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//##### MIDDLEWARE ##########
app.use(morgan('dev')); // third party middleware.

app.use(express.json()); // this is middleware. this will provide value for "req.body", without this show undefined.

// Create Custom MiddleWare.

app.use((req1, res1, next) => { // params name up to you.
  console.log("This is our custom middleware!!!");
  next(); // next1/next function call next middleware in stack.
});

// Note: In case of middleware Order of middleware is more important, otherwise it will not work properly.
// If middleware code write after routes then this case request and response cycle will complete before this in that case middleware not call.

app.use((req, res, next) => {
  req.requestTime = `Time comes from middleware: ` + new Date().toISOString();
  next();
});

// Post API callbacks.
/*
  app.get("/", (req, res) => {
    // we can also send string.
    // res.status(200).send("Hello world");
    res
      .status(200)
      .json({ message: "ExpressJs is running on port 3000", app: "natours" });
  });
*/

// Post API callbacks.
/*
  app.post("/", (req, res) => {
    res.send("Hello world from POST API"); // status code 200 is by default.
  });
*/

//##### ROUTE HANDLER ##########

// Note when we call API event loop is working from app.get, so that we can read file at top, because its read once for all request.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTours = (req, res) => {
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
const getSingleTour = (req, res) => {
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
const createTour = (req, res) => {
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
const updateTour = (req, res) => {
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
const deleteTour = (req, res) => {

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

//##### ROUTES ##########

// Note: To refectoring the code, all routes are togather and handler are togather.
/*
    app.get("/nitours/v1/tours/:id", getSingleTour);
    app.get("/nitours/v1/tours", getTours);
    app.post("/nitours/v1/tours", createTour);
    app.patch("/nitours/v1/tours/:id", updateTour);
    app.delete("/nitours/v1/tours/:id", deleteTour);
 */

// Note in express we have route method to combine similar route togather.

app.route("/nitours/v1/tours").get(getTours).post(createTour);
app.route("/nitours/v1/tours/:id").get(getSingleTour).patch(updateTour).delete(deleteTour);



//##### SERVER START ##########
const port = 3000;
app.listen(port, () => {
  console.log("App is running on port " + port);
});
