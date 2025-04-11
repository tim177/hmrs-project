const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");
const leaveRoutes = require("./routes/leaves");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://hmrs-frontend.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Define the routes here
app.use("/api/user", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/leaves", leaveRoutes);

// Catch all route for undefined paths
app.all("*", (req, res) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  res.status(404).json({
    status: "fail",
    message: err.message,
  });
});

module.exports = app;
