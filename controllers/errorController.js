module.exports = (err, req, res, next) => {
  // console.log(err.stack); // This will display all stack of error like debugger.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // ERROR: show error as per instance and this will show in postman.
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
