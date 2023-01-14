const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    validate: {
      // Custom validator work only in save/Create, not working with update.
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!!!',
    },
  },
});

// Create pre hooks to encrypt password.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // isModified is function to accept fieldName to check modified or not.
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12); // default value 10 for cost parameter.
  // So this hash() here is actually the asynchronous version and return a promise.

  // but there also is a synchronous version we do not want to use the synchronous version because
  //that will block the event loop and then prevent other users from using the application.

  this.confirmpassword = undefined; // basically do not need to store confirmpass in DB.
  // this is just for validation purpose only.
});

const User = mongoose.model('User', userSchema);

module.exports = User;
