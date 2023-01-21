const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

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
  startLocation: { // we also set 0 day as start day, but keep startLocation as seperate.
    // GeoJson
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  locations: [ // always create array, which is create new document inside parent document.
    {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
  // guides: Array, // save array type value.
  guides: [ // Create Reference key from User Model Document.
    {
      type: mongoose.Schema.ObjectId, // special type store Document Object of another model.
      ref: 'User', // no need to require('User') model, its works without require.
    },
  ],
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
/*
    tourSchema.pre('save', function (next) {
      // console.log(this); //this only hold the processed document.
      next();
    });
*/
// We can use multiple "pre" hook/MIDDLEWARE togather.
tourSchema.pre('save', function (next) {
  // console.log(this); this only hold the processed document.
  this.slug = slugify(this.name, { lower: true }); // CALL ANOTHER MIDDLEWARE INSIDE THIS.
  next();
});
// .populate in QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

/*
  // Tour Guide Embeding: This will call only for new Document save/create() not for update.
  tourSchema.pre('save', async function (next) {
    // Here map return promise of user Data not actully userData.
    const userPromises = this.guides.map(async (id) => await User.findById(id));
    // Process promise to get actual data, need to call Promise.all() method.
    this.guides = await Promise.all(userPromises);
    next();
  });
*/
// "this" not available in .post(), only doc and next available.
/*
    tourSchema.post('save', (doc, next) => {
      console.log(doc);
      next();
    });
*/

// QUERY MIDDLEWARE: This will work with "find" hook and "this" will hold current query.
// QUERY MIDDLEWARE: also work with "count", "all types of find", "remove" and "all types of Update"

// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) { // working with all the commands start with "find".
  this.find({ secretTour: { $ne: true } }); // this will alter the query before execute.

  this.start = Date.now(); // Set time for query start in miliSeconds.
  // console.log(this);
  next();
});

// "this" available in "post" QUERY MIDDLEWARE.
tourSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  console.log(`Query tooks time: ${Date.now() - this.start} in milliSeconds!!!`);
  next();
});

// AGGREGATE MIDDLEWARE:
tourSchema.pre('aggregate', function (next) {
  // this will add extra match in pipeline.
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline()); // show the pipline of aggregation.
  next();
});

// virtual populate: incase of parent referencing parent does not know who is child.
// So that case we need to bind parent-child with help of virtual populate.
tourSchema.virtual('reviews', { // create virtual field in /tours/:id API.
  ref: 'Review', // Target/Child Model (which have parent reference).
  foreignField: 'tour', // Field of child(Review) model.
  localField: '_id', // Field of parent(Tour) model
});
// Note: Example set with getSingleTour.

// Create modal (Tour), variableName and modal name always Uppercase.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
