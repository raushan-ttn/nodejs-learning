const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => {
  // console.log(con.connections);
  console.log('Database connected Successfully!!!');
}).catch((err) => {
  console.log(err);
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB.
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Successfully loaded.');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // exit the current process.
};


// DELETE DATA FROM DB.

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Successfully DELETED.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Execute commands.
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv); // show all arguments from terminal.

// Note: example command
// $ node ./dev-data/import-dev-data.js --import
// $ node ./dev-data/import-dev-data.js --delete
