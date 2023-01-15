const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// JWT_SECRET: Using HSA 256 encryption algorithem and should at least be 32 characters long.
const signToken = (id) => jwt.sign({ id: id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

// catchAsync() function accept async function and handle catch(). so that we don't
// need to add catch() here.
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
  });

  // CREATE TOKEN.
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token, // ES-6 no need to define key and value if both have same name, it automatically pick.
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check email and password exist or not.
  if (!email || !password) {
    // Here next() call the next middleware from app.js
    // but always use "return" before next().
    // otherwise we get error "Cannot set headers after they are sent to the client"
    return next(new AppError('Please provide email and password', 400));
  }
  // Check user exists and password is correct.
  // Note: if field "select" false in model, but we need to get here then we can use
  // .select("+fieldname").
  const user = await User.findOne({ email }).select('+password');
  // console.log(user);
  // Here we need to convert user entered password to hash and match with encripted db password.
  // correctPassword() is instance method defined in model and available for each documents.

  // Note: Here .findOne and .correctPassword() both functions are async function and if user-
  // doesnot exit here then .correctPassword() will not run because "user.password" not available.

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // if every thing ok then send token to client.
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
