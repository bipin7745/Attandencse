import mongoose from "mongoose";

const assetAssignmentSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetsDevice",
      required: true,
    },
    assignedQty: { type: Number, default: 1 },
    assignedToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "AssetRequest" },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Defective"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AssetAssignment", assetAssignmentSchema);
