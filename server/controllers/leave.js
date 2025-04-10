const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// Get all leaves
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ date: -1 }); // optional: sort by date
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

    console.log("🧾 Request body:", req.body);
    console.log("📎 Uploaded file:", req.file);

    // Find employee by full name
    const employee = await Employee.findOne({ fullName });
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
      hasDocuments: !!req.file, // true if file is uploaded
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    console.error("Error adding leave:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update leave
const updateLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const updates = req.body;

    const updatedLeave = await Leave.findByIdAndUpdate(leaveId, updates, {
      new: true,
    });

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(updatedLeave);
  } catch (err) {
    console.error("Error updating leave:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete leave
const deleteLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const deletedLeave = await Leave.findByIdAndDelete(leaveId);
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
