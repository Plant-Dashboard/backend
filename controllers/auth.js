const User = require("../models/User");
const crypto = require("crypto");
const asyncHandler = require("../middleware/async");
const ErrorReponse = require("../utils/errorResponse");

//@desc    Check if the password is correct for camera access
//@route   POST /api/v1/auth/camera
//@access  Public
exports.checkPassword = asyncHandler(async (req, res, next) => {
  const {password} = req.body;

  if (password !== process.env.CAMERA_ACCESS) {
    return next(new ErrorReponse("Invalid password", 401));
  } else {
    res.status(200).json({allowAccess: true});
  }
});

//@desc    Register user
//@route   POST /api/v1/auth/register
//@access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const {name, email, password, role} = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenReponse(user, 200, res);
});

//@desc    Login user
//@route   POST /api/v1/auth/login
//@access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorReponse("Please provide an email and password", 400));
  }

  //Check for user
  const user = await User.findOne({email}).select("+password");

  if (!user) {
    return next(new ErrorReponse("Invalid credentials", 401));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorReponse("Invalid credentials", 401));
  }

  sendTokenReponse(user, 200, res);
});

//@desc    Get current logged in user
//@route   GET /api/v1/auth/me
//@access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({success: true, data: user});
});

//@desc    Log user out/clear cookie
//@route   GET /api/v1/auth/logout
//@access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({success: true, data: {}});
});

//Get token from model, create cookie and send response
const sendTokenReponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    //30 days from now
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({success: true, token});
};
