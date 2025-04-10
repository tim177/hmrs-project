const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// Get all leaves for current user
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ createdBy: req.user._id })
      .sort({ date: -1 })
      .populate("employeeId", "fullName position");

    res.json(leaves);
  } catch (err) {
    console.error("Error fetching leaves:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new leave
const addLeave = async (req, res) => {
  try {
    const { fullName, date, reason } = req.body;

    // Find employee created by the user
    const employee = await Employee.findOne({
      fullName,
      createdBy: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.attendanceStatus !== "Present") {
      return res.status(400).json({
        message: "Leave can only be applied by present employees",
      });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      fullName: employee.fullName,
      position: employee.position,
      date,
      reason,
      hasDocuments: !!req.file,
      createdBy: req.user._id, // <-- 💥 associate leave with user
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    console.error("Error adding leave:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update leave (user scoped)
const updateLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const updates = req.body;

    const updatedLeave = await Leave.findOneAndUpdate(
      { _id: leaveId, createdBy: req.user._id }, // scoped to current user
      updates,
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(updatedLeave);
  } catch (err) {
    console.error("Error updating leave:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete leave (user scoped)
const deleteLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const deletedLeave = await Leave.findOneAndDelete({
      _id: leaveId,
      createdBy: req.user._id,
    });

    if (!deletedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    console.error("Error deleting leave:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addLeave,
  updateLeave,
  deleteLeave,
  getAllLeaves,
};
