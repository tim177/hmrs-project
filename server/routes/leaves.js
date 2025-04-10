const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../controllers/auth");

// Set up memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  addLeave,
  getAllLeaves,
  updateLeave,
  deleteLeave,
} = require("../controllers/leave");

// ✅ PROTECTED ROUTES
router.get("/", protect, getAllLeaves);
router.post("/", protect, upload.single("documents"), addLeave);
router.patch("/:id", protect, updateLeave);
router.delete("/:id", protect, deleteLeave);

module.exports = router;
