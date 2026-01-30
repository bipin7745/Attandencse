import mongoose from "mongoose";

const taskMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "TaskMessage", default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TaskMessage", taskMessageSchema);
