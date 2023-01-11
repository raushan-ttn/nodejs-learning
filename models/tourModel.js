const mongoose = require('mongoose');
const slugify = require('slugify');

// Create Schema/collection using mongoose.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  startDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // select false: means pernanently hide from select.
  },
}, {
  toJSON: { virtuals: true }, // this Options are helps to show "virtual field" in API as field.
  toObject: { virtuals: true },
});

// virtual properties.
tourSchema.virtual('durationweek').get(function () { // normal function becoz we need to use this keyword.
  return this.duration / 7;
});

// virtual fields are not part of schema, this will generate eachtime when we call modal.
// So that Tour.find({durationweek : 1}) // this type of query will not work.
// this is not best practice, we need to separate bussiness logic and application logic as much -
// as separated as possible.

// DOCUMENT MIDDLEWARE: runs before .create() and .save() not work before .insertMany().
tourSchema.pre('save', function (next) {
  // console.log(this); this only hold the processed document.
  this.slug = slugify(this.name, { lower: true }); // CALL ANOTHER MIDDLEWARE INSIDE THIS.
  next();
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
