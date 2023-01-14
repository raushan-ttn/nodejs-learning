const mongoose = require('mongoose');
const validator = require('validator');

// Create schema for user.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter user name.'],
  },
  email: {
    type: String,
    required: [true, 'Please enter email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter password.'],
    minlength: 8,
  },
  confirmpassword: {
    type: String,
    required: [true, 'Please enter confirm password.'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
