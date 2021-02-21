const express = require("express");
const {
  getReadings,
  getReading,
  createReading,
  updateReading,
  deleteReading,
} = require("../controllers/readings");

const advancedResults = require("../middleware/advancedResults");
const Reading = require("../models/Reading");
const router = express.Router();

router.route("/").get(advancedResults(Reading), getReadings).post(createReading);
router.route("/:id").get(getReading).put(updateReading).delete(deleteReading);

module.exports = router;
