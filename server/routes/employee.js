const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();

//Get all candidates with selected fields
router.get("/candidates", async (req, res, next) => {
  try {
    // Fetch all candidates with all fields
    const candidates = await Employee.find({});
    console.log(candidates);
    res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

router.post("/candidates", async (req, res, next) => {
  try {
    console.log("candidaite 🤡🤡", req.body);
    const { fullName, email, phone, position, experience, resume, agreement } =
      req.body;

    const newCandidate = new Employee({
      fullName,
      email,
      phone,
      position,
      experience,
      //resume: null
    });

    await newCandidate.save();

    res.status(201).json({ message: "Candidate Added Successfully" });
  } catch (error) {
    console.error("Error adding candidate:", error);
    res.status(500).json({ message: "Failed to add candidate" });
  }
});

// Update a candidate
router.put("/candidates/:id", async (req, res) => {
  try {
    const candidateId = req.params.id;
    const updatedData = req.body;

    // Skip all validators
    const updatedCandidate = await Employee.findByIdAndUpdate(
      candidateId,
      { $set: updatedData },
      {
        new: true,
        runValidators: false, // Ensure validators are off
        overwrite: false, // Prevent full replacement
      }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      message: "Candidate updated successfully",
      updatedCandidate,
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: "Failed to update candidate" });
  }
});

// Delete a candidate
router.delete("/candidates/:id", async (req, res) => {
  try {
    const candidateId = req.params.id;

    const deletedCandidate = await Employee.findByIdAndDelete(candidateId);

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
