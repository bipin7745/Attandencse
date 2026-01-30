import TaskMessage from "../models/TaskMessage.js";


export const createMessage = async (req, res) => {
  const { text, taskId, replyTo } = req.body;
  if (!text || !taskId) return res.status(400).json({ message: "Text and taskId required" });

  try {
    const newMessage = new TaskMessage({
      text,
      sender: req.user.id,
      task: taskId,
      replyTo: replyTo || null,
    });

    await newMessage.save();

    const populatedMessage = await TaskMessage.findById(newMessage._id)
      .populate("sender", "username")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "username" },
      });

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ message: "taskId is required" });

  try {
    const messages = await TaskMessage.find({ task: taskId })
      .populate("sender", "username")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "username" },
      })
      .sort({ createdAt: 1 });

    res.status(200).json({ data: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
