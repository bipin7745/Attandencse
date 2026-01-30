import Message from "../models/Message.js";

export const createMessage = async (req, res) => {
  const { text, projectId, replyTo } = req.body;

  if (!text || !projectId) {
    return res.status(400).json({ message: "Text and projectId required" });
  }

  try {
    const newMessage = new Message({
      text, 
      sender: req.user.id,
      project: projectId,
      replyTo: replyTo || null,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
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
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "projectId is required" });
  }

  try {
    const messages = await Message.find({ project: projectId })
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
