const express = require("express");
const morgan = require('morgan');

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

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

//##### ROUTES ##########

// Note: To refectoring the code, all routes are togather and handler are togather.
/*
    app.get("/nitours/v1/tours/:id", getSingleTour);
    app.get("/nitours/v1/tours", getTours);
    app.post("/nitours/v1/tours", createTour);
    app.patch("/nitours/v1/tours/:id", updateTour);
    app.delete("/nitours/v1/tours/:id", deleteTour);
 */

// Mounting multiple Routers
//Mounting the routers, has to come after all of these definitions or at least after we declared a variable.

app.use('/nitours/v1/tours', tourRouter); // connect new router (tourRouter) to application to use middleware.
app.use('/api/v1/users', userRouter); // Can't use routers before we declare them.


// app.js is basically use for global middleware.

module.exports = app;
