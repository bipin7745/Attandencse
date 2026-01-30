import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  const {
    projectName,
    projectDescription,
    estimatedDays,
    assignedProjectManager,
    assignedEmployees
  } = req.body;

  if (!projectName || !projectDescription || !estimatedDays || !assignedProjectManager) {
    return res.status(400).json({
      message: "Please provide all required fields."
    });
  }

  try {
    const newProject = new Project({
      projectName,
      projectDescription,
      estimatedDays,
      assignedProjectManager,
      assignedEmployees: assignedEmployees || []
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProjects = async (req, res) => {
  try {
    const { id, role } = req.user; // JWT middleware thi

    let filter = {};

    if (role === "admin") {
      // Admin ne badha projects
      filter = {};
    } 
    else if (role === "projectmanager") {
      // Project manager ne potana assigned projects
      filter = { assignedProjectManager: id };
    } 
    else if (role === "employee") {
      // Employee ne je projects ma assigned hoy
      filter = { assignedEmployees: id };
    }

    const projects = await Project.find(filter)
      .populate("assignedProjectManager", "username")
      .populate("assignedEmployees", "username");

    res.status(200).json({
      data: projects
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("assignedProjectManager", "username")
      .populate("assignedEmployees", "username");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    // Only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete projects" });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project deleted successfully" });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};