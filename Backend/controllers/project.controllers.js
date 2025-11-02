// project.controllers.js
import Project from "../models/project.model.js";
import Application from "../models/application.model.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can create projects" });
    }

    const { title, description, skillsRequired, budget, deadline } = req.body;
    const project = await Project.create({
      title,
      description,
      skillsRequired,
      budget,
      deadline,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("createdBy", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (req.user._id.toString() !== project.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Project updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (req.user._id.toString() !== project.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

