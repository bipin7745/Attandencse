import mongoose from "mongoose";

const assetsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quality: {
    type: Number,
    required: true,
    min:0,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active", 
  },
}, { timestamps: true });

export default mongoose.model("AssetsDevice", assetsSchema);
