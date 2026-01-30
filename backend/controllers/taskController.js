import Task from "../models/Task.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      startDate,
      endDate,
      estimatedDays,
    } = req.body;

    if ( !title || !projectId || !assignedTo ||    assignedTo.length === 0 ||  !startDate || !endDate )
       {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const assignedIds = assignedTo.map((id) => new mongoose.Types.ObjectId(id));

    const start = new Date(startDate);
    if (isNaN(start.getTime()))
      return res.status(400).json({ message: "Invalid startDate" });

    let end = new Date(endDate);
    const projectEnd = new Date(project.createdAt);

    if (start < projectEnd) {
      return res.status(404).json({
        message: "start date must be after project start date",
      });
    }

    projectEnd.setDate(projectEnd.getDate() + Number(project.estimatedDays));
    if (end > projectEnd) end = projectEnd;

    const task = new Task({
      title,
      description,
      estimatedDays,
      project: projectId,
      startDate: start,
      endDate: end,
      assignedBy: req.user.id,
      assignedTo: assignedIds,
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "username")
      .populate("assignedBy", "username")
      .populate("project", "projectName");

    res.status(201).json({ success: true, data: populatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "employee") filter.assignedTo = req.user.id;
    if (req.query.projectId) filter.project = req.query.projectId;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "username")
      .populate("assignedBy", "username")
      .populate("project", "projectName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "username")
      .populate("assignedBy", "username")
      .populate("project", "projectName");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
