import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const assetRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true, default: () => uuidv4() },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetsDevice",
      required: true,
    },
    assetName: {
      type: String,
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetAssignment",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, required: true },
    reqstatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    feedback: { type: String, default: "" },
    deviceCondition: {
      type: String,
      enum: ["Active", "Defective"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AssetRequest", assetRequestSchema);
