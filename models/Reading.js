const mongoose = require("mongoose");

const ReadingSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      trim: true,
      required: [true, "Please include the temperature"],
    },
    humidity: {
      type: Number,
      trim: true,
      required: [true, "Please include the humidity"],
    },
    readingTime: {
      type: Date,
      default: Date.now(),
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("Reading", ReadingSchema);
