import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["In", "Out"], required: true },
    time: { type: Date, required: true },
    isNew: { type: Boolean, default: true }, // flag for new checks
    edited: { type: Boolean, default: false }, // flag if user updated old check
  },
  { _id: false }
);

const AttendanceRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
    checks: { type: [CheckSchema], required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AttendanceRequest", AttendanceRequestSchema);
