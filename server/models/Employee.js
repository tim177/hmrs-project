const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
    dob: { type: Date },
    department: { type: String },
    position: { type: String, required: true },
    experience: { type: String },
    task: { type: String },
    status: {
      type: String,
      enum: ["new", "selected", "rejected"],
      default: "new",
    },
    attendanceStatus: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite error in development
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
