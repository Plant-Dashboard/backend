const Reading = require("../models/Reading");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc Get all readings
// @route GET /api/v1/readings
// @access Public
exports.getReadings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single readings
// @route GET /api/v1/readings/:id
// @access Public
exports.getReading = asyncHandler(async (req, res, next) => {
  let reading = await Reading.findById(req.params.id);

  if (!reading) {
    return next(new ErrorResponse(`Reading not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({success: true, reading});

  // next(new ErrorResponse(`Reading not found with id of ${req.params.id}`, 404));
});

// @desc Create new reading
// @route POST /api/v1/readings
// @access Private
exports.createReading = asyncHandler(async (req, res, next) => {
  const reading = await Reading.create(req.body);
  res.status(200).json({success: true, reading});
});

// @desc Update a  reading
// @route PUT /api/v1/readings/:id
// @access Private
exports.updateReading = asyncHandler(async (req, res, next) => {
  const reading = Reading.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!reading) {
    return res.status(400).json({success: false, msg: `No reading with id: ${req.params.id}`});
  }
  res.status(200).json({success: true, reading});
});

// @desc Delete a  reading
// @route PUT /api/v1/readings/:id
// @access Private
exports.deleteReading = asyncHandler(async (req, res, next) => {
  const reading = Reading.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!reading) {
    return res.status(400).json({success: false, msg: `No reading with id: ${req.params.id}`});
  }
  res.status(200).json({success: true});
});
