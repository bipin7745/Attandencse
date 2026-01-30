import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true },
    estimatedDays: { type: Number, required: true },
    assignedProjectManager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
