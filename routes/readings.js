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
const {protect, authorize} = require("../middleware/auth");

router.route("/").get(advancedResults(Reading), getReadings).post(protect, authorize("admin"), createReading);
router
  .route("/:id")
  .get(getReading)
  .put(protect, authorize("admin"), updateReading)
  .delete(protect, authorize("admin"), deleteReading);

module.exports = router;
