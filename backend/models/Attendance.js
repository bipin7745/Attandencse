// models/Attendance.js
import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["In", "Out"],
      required: true,
    },
    time: {
      type: String, // store ISO string
      required: true,
    },
  },
  { _id: false },
);

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    checks: [CheckSchema],
    requestStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: { type: String, default: "" },
    totalHours: { type: Number, default: 0 },
    Break: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
