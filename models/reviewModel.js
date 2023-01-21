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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
