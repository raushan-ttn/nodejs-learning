const mongoose = require('mongoose');

// Create Schema/collection using mongoose.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name.'], // this is validator and we can also create our own.
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price'],
  },
});

// Create modal (Tour), variableName and modal name always Uppercase.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// Sample code to insert record in schema.
// const testTour = new Tour({
//   name: 'The Forest gump.',
//   price: 650,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log('Documents:', doc);
//   }).catch((err) => {
//     console.log('Error: ', err);
//   });
