const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Delete Document: Factory function.
exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with this Id.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Update Document: Factory function.
exports.updateOne = (Model) => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // pass some optional argument as per mongoose.
    runValidators: true, // this will support schema validators in model.
  });

  if (!doc) {
    return next(new AppError('No document found with this Id.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc, // As per ES-6: property name has the same name of the value.
    },
  });
});
