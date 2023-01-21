const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//##### MIDDLEWARE ##########
// Set Security HTTP headers.
app.use(helmet());

// Set Development logging.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // third party middleware. this will only call in developemnt mode not live mode.
}

// Set Limit request for same IP.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Plesae try again an hour!',
});
app.use('/api', limiter); // this will work on all endpoint start with '/api'.

// Body parser: parse data from request body.
// this is middleware. this will provide value for "req.body", without this show undefined.
app.use(express.json());

// Data sanitization againts NOSQL query injection.
app.use(mongoSanitize()); // return middleware function.

// Data sanitization againts XSS.
app.use(xss());

// Remove Parameter Polutions (duplicate parameter).
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity'], // we can whitelist some parameters (allow duplicate for these).
}));

// Reading static files.
// To server static file from server using middleWare.
app.use(express.static(`${__dirname}/public`)); // Access files under "public directory" like 127.0.0.1/img/favicon.png

// Create Custom MiddleWare.
// params name up to you.
app.use((req1, res1, next) => {
  console.log('This is our custom middleware!!!');
  next(); // next1/next function call next middleware in stack.
});

// Note: In case of middleware Order of middleware is more important, otherwise it will not work properly.
// If middleware code write after routes then this case request and response cycle will complete before this in that case middleware not call.

app.use((req, res, next) => {
  req.requestTime = `Time comes from middleware: ${new Date().toISOString()}`;
  // console.log(req.headers); // check headers from request.
  next();
});

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

app.use('/api/v1/tours', tourRouter); // connect new router (tourRouter) to application to use middleware.
app.use('/api/v1/users', userRouter); // Can't use routers before we declare them.
// app.use('/api/v1/reviews', reviewRouter); // No need using nested route.

// CREATE a middleware to handle 404 request for all (get/post/put/patch/delete).
// THIS MIDDLEWARE AT END OF app.js file, and if any request not match the above specified URL.
// that means response cycle not completed yet, and then this will BY DEfault 404.

app.all('*', (req, res, next) => {

  /*
      res.status(404).json({
          status: 'fail',
          message: `Can't find URL ${req.originalUrl} on this Server!!!`,
        });
    */

  /*
    // CREATE ERROR: we don't need to write here, we need to write own Error class.
    const err = new Error(`Can't find URL ${req.originalUrl} on this Server!!!`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
  // basically next() use for jump to error middleware.next() accept argument no matter what it is.
*/
  // This will handle Error.
  next(new AppError(`Can't find URL ${req.originalUrl} on this Server!!!`, 404));
});

// ERROR HANDLING MIDDLEWARE.

app.use(globalErrorHandler);

// app.js is basically use for global middleware.

module.exports = app;
