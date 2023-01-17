const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Filter Object with only allowed keys/field.
const filterData = (obj, ...allowdFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowdFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) validate password field.
  if (req.body.password) {
    return next(new AppError('This route is not for password update, please use /updatePassword', 400));
  }
  // 2) Filter body object.
  const filterBody = filterData(req.body, 'name', 'email');
  // 3) Save data in collection.
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  // 4) Send response to client.
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getUsers = (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: "Get Users page"
    });
}

exports.createUser = (req, res) => {
  res.status(201).json({
    status: "SUCCESS",
    data: {
      tour: "User created",
    }
  })
}

exports.getSingleUser = (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: "Get Single User data"
    });
}

exports.updateUser = (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: {
        tour: "Updated user" // Just for placeholder, no need to build whole logic here.
      }
    });
}

exports.deleteUser = (req, res) => {
  res
    .status(204)
    .json({
      status: "SUCCESS",
      data: {
        tour: "deleted user" // Just for placeholder, no need to build whole logic here.
      }
    });
}
