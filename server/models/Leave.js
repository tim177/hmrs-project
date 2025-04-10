const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Approved", "Rejected"],
      default: "New",
    },
    hasDocuments: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
