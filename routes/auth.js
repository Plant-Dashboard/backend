const express = require("express");
const {register, login, logout, getMe, checkPassword} = require("../controllers/auth");

const router = express.Router();
const {protect} = require("../middleware/auth");

router.post("/register", register);
router.post("/camera", checkPassword);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
