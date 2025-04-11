const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connection Successful"))
  .catch((error) => console.log("❌ DB Connection Error:", error));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Handle Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log("💥 Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});
