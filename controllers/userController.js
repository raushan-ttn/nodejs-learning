const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

/* const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
}); */

// Incase of memoryStorage filename not defined, so if we want to use fileName for dbStorage.
// We need to define manually.
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a image, please upload image only', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  console.log(req.file);
  console.log(req.body);

  // 1) validate password field.
  if (req.body.password) {
    return next(new AppError('This route is not for password update, please use /updatePassword', 400));
  }
  // 2) Filter body object.
  const filterBody = filterData(req.body, 'name', 'email');

  // Save filename in DataBase.
  if (req.file) filterBody.photo = req.file.filename;

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'sucess',
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res
    .status(200)
    .json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
});

exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      user: 'User created',
    },
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getSingleUser = factory.getOne(User);
// Create request.: No need because we have signUp function.
// exports.createUser = factory.createOne(User);
// Update User.
exports.updateUser = factory.updateOne(User);
// Delete User.
exports.deleteUser = factory.deleteOne(User);
