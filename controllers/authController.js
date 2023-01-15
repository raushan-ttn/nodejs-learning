const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// catchAsync() function accept async function and handle catch(). so that we don't
// need to add catch() here.
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
  });

  // JWT_SECRET: Using HSA 256 encryption algorithem and should at least be 32 characters long.
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token, // ES-6 no need to define key and value if both have same name, it automatically pick.
    data: {
      user: newUser,
    },
  });
});
