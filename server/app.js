const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");

const app = express();

app.use(cors());
app.use(express.json());

// Define the routes here
app.use("/api/user", authRoutes);
app.use("/api/employee", employeeRoutes);

// Catch all route for undefined paths
app.all("*", (req, res) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  res.status(404).json({
    status: "fail",
    message: err.message,
  });
});

module.exports = app;
