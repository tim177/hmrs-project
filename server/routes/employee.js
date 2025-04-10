const express = require("express");
const Employee = require("../models/Employee");
const { protect } = require("../controllers/auth");
const multer = require("multer");

const router = express.Router();

// Setup multer for file upload
const upload = multer({ dest: "uploads/" });

// 👥 Get all candidates for the logged-in user
router.get("/candidates", protect, async (req, res) => {
  try {
    const candidates = await Employee.find({ createdBy: req.user._id });
    res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

// ➕ Create new candidate for the logged-in user

router.post(
  "/candidates",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      const { fullName, email, phone, position, experience } = req.body;

      console.log("💡 Body:", req.body); // Should contain text fields
      console.log("📄 Resume file:", req.file); // Contains uploaded resume file info

      const newCandidate = new Employee({
        fullName,
        email,
        phone,
        position,
        experience,
        resume: req.file?.filename, // or req.file.path if you want full path
        createdBy: req.user._id,
      });

      await newCandidate.save();

      res.status(201).json({ message: "Candidate Added Successfully" });
    } catch (error) {
      console.error("❌ Error adding candidate:", error);
      res.status(500).json({ message: "Failed to add candidate" });
    }
  }
);

// 🔁 Update candidate (only if it belongs to user)
router.put("/candidates/:id", protect, async (req, res) => {
  try {
    const candidateId = req.params.id;
    const updatedData = req.body;

    const candidate = await Employee.findOneAndUpdate(
      { _id: candidateId, createdBy: req.user._id }, // 🎯 ensure user owns it
      { $set: updatedData },
      { new: true, runValidators: false, overwrite: false }
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      message: "Candidate updated successfully",
      updatedCandidate: candidate,
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: "Failed to update candidate" });
  }
});

// ❌ Delete candidate (only if it belongs to user)
router.delete("/candidates/:id", protect, async (req, res) => {
  try {
    const candidateId = req.params.id;

    const deletedCandidate = await Employee.findOneAndDelete({
      _id: candidateId,
      createdBy: req.user._id,
    });

    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Failed to delete candidate" });
  }
});

module.exports = router;
