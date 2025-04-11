const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper: Send JWT token response
const sendToken = (user, statusCode, res) => {
  const token = user.generateJwtToken();

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 2 * 60 * 60 * 1000, //2hr
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
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
  console.log(req.body);
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

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @route GET /api/auth/private
const getPrivateData = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "You got access to private data",
  });
});

const getMe = async (req, res) => {
  try {
    console.log("Cookies received:", req.cookies); // 👈 check if token is visible
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

const protect = async (req, res, next) => {
  let token;

  // Get token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getPrivateData,
  protect,
  getMe,
};
