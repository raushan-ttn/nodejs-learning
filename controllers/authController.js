const { promisify } = require('util'); // NodeJs core module.
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
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

// MIDDLEWARE for GetAllTours: loggedin user only.
exports.protectTours = catchAsync(async (req, res, next) => {
  let token;
  // Getting token and check it's there.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    // ERROR Code "401" means request is correct but data is not sufficient.
    return next(new AppError('You are not logged in! please log in to get access.', 401));
  }
  // Verification token.
  // promisify accept function as argument and return a function as well. LIKE "Currying"
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    // UseCase: user is using correct token, but suppose somehow deleted from system.
    // In that case check userId and throw error.
    return next(new AppError('the user belonging to this token no longer exists.', 401));
  }

  // check if user changed password after the token was issued.
  if (currentUser.changedPasswordAfter(decoded.iat)) { // "iat" means issued at.
    return next(new AppError('User recently changed there password, Please login again!!!', 401));
  }

  // GRANT Access to PROTECTED ROUTE.
  req.user = currentUser;
  // if we pass data from one middleware to another then simply put into request object.
  next();
});

exports.ristrictTo = (...roles) => (req, res, next) => {
  // roles = ['admin','lead-guide'];
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to do this action!', 403));
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user for this email!', 404));
  }
  // 2) Generate the random reset token.
  const resetToken = user.createPasswordResetToken();
  // instance method just modified records in db, but not update the document (like expireTime).
  // So we need to save document.
  // Bypass Schema validators: we need to use "validateBeforeSave". its mongoose feature.
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email.
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  console.log(resetUrl);

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}\nIf you didn't forgot your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 minuts)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    // If something get error in send email then reset both fields in db and call global error.
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(new AppError('Unable to sent email, Please try again later!', 500));
  }
});

exports.resetPassword = (req, res, next) => {

};
