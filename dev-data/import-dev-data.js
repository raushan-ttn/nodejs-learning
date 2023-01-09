const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');

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

// IMPORT DATA INTO DB.
const importData = async () => {
  try {
    await Tour.create(tours);
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
// $ node import-dev-data.js --import
// $ node import-dev-data.js --delete
