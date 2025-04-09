const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Helper: Send JWT token response
const sendToken = (user, statusCode, res) => {
  const token = user.generateJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

// @route POST /api/auth/register
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log("user", req.body);
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const newUser = await User.create({ username, email, password });
  sendToken(newUser, 201, res);
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please provide both email and password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  sendToken(user, 200, res);
});

// @route GET /api/auth/private
const getPrivateData = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "You got access to private data",
  });
});

module.exports = {
  register,
  login,
  getPrivateData,
};
