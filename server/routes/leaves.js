const express = require("express");
const router = express.Router();
const multer = require("multer");

// Set up memory storage (you can switch to disk or cloud later)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controller
const {
  addLeave,
  getAllLeaves,
  updateLeave,
  deleteLeave,
} = require("../controllers/leave");

// GET all leaves
router.get("/", getAllLeaves);

// ✅ POST with file upload support
router.post("/", upload.single("documents"), addLeave);

// PUT and DELETE
router.patch("/:id", updateLeave);
router.delete("/:id", deleteLeave);

module.exports = router;
