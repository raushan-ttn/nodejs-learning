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

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
