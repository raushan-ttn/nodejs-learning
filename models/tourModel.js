const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// Create Schema/collection using mongoose.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
    // third party validators,
    // validate: [validator.isAlpha, 'Tour name must only contain characters.'],
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
  priceDiscount: {
    type: Number,
    validate: { // custom validator: is function which is return "true" or "false".
      validator: function (val) {
        // This only points to current doc on NEW document creation. becoz "this" keyword.
        // There are multiple custom library available in npm, we can also use them.
        return val < this.price;
      },
      message: 'priceDiscount ({VALUE}) must be less than Price!!!',
    },
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
  secretTour: {
    type: Boolean,
    default: false,
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
// DOCUMENT MIDDLEWARE: also work with "remove" and "validate" along with "save".
tourSchema.pre('save', function (next) {
  console.log(this); //this only hold the processed document.
  next();
});
// We can use multiple "pre" hook/MIDDLEWARE togather.
tourSchema.pre('save', function (next) {
  // console.log(this); this only hold the processed document.
  this.slug = slugify(this.name, { lower: true }); // CALL ANOTHER MIDDLEWARE INSIDE THIS.
  next();
});

// "this" not available in .post(), only doc and next available.
tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE: This will work with "find" hook and "this" will hold current query.
// QUERY MIDDLEWARE: also work with "count", "all types of find", "remove" and "all types of Update"

// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) { // working with all the commands start with "find".
  this.find({ secretTour: { $ne: true } }); // this will alter the query before execute.

  this.start = Date.now(); // Set time for query start in miliSeconds.
  console.log(this);
  next();
});

// "this" available in "post" QUERY MIDDLEWARE.
tourSchema.post(/^find/, function (docs, next) {
  console.log(docs);
  console.log(`Query tooks time: ${Date.now() - this.start} in milliSeconds!!!`);
  next();
});

// AGGREGATE MIDDLEWARE:
tourSchema.pre('aggregate', function (next) {
  // this will add extra match in pipeline.
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline()); // show the pipline of aggregation.
  next();
});

//

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
