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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please enter password.'],
    minlength: 8,
    select: false, // hide "password" field from any find query.
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
  // this property/field updated everytime when user changed their password.
  passwordChangedAt: Date,
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

// we can't do manually becoz "candidatePassword" is not hashed and "userPassword" is encrypted.
// compare() function return "true" if both password matched.
// this method is type of instance method, it will available with all documents.
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimeStamp; // return true or false (100 < 200)
  }
  return false; // "false" means user has not changed there password after the token was issued.
};

const User = mongoose.model('User', userSchema);

module.exports = User;
