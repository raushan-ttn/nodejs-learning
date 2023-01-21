const mongoose = require('mongoose');

// "Example of Parent Referencing-save ParentID in child Collection".
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty'],
  },
  rating: {
    type: Number,
    default: 3.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belongs to a user'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belongs to a tour'],
  },
}, {
  toJSON: { virtuals: true }, // virtuals provide to create/show "virtual field" in API as field.
  toObject: { virtuals: true },
});

// Query MiddleWare: for .populate()
reviewSchema.pre(/^find/, function (next) {
  /*
    this.populate({
        path: 'user',
        select: 'name photo',
      }).populate({
        path: 'tour',
        select: 'name',
      });
    */
  // Review model populate tours, and due to "virtual populate" tour also call reviews. so that
  // case it will called 3 times (tour->reviews->tour->reviews) this will do performance impact
  // So that case show only user, but it's only based on project requirement not a thumb rule.
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
