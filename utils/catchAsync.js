// OLD WAY.
// module.exports = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   }
// };

// NEW WAY: Basically this function accept a async function, and return/call -
// this function automatically and handle catch() block.
// with this wapper function we can replace/remove all catch block for all async functions.

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Here fn().catch() call next, means catch() block call next middleware.
// IN app.js after all route we have call MIDDLEWARE app.use(globalErrorHandler);
// this middleware handle error from catchAsync().

// Note: catchAsync() is not related to express, this is just way of working async
// and error handling JS.
