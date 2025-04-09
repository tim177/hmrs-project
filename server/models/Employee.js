const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
