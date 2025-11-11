import Application from "../models/application.model.js";
import Project from "../models/project.model.js";

export const getFreelancerSummary = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const totalApplications = await Application.countDocuments({ freelancerId });
    const acceptedApplications = await Application.countDocuments({ freelancerId, status: "accepted" });
    const rejectedApplications = await Application.countDocuments({ freelancerId, status: "rejected" });
    const pendingApplications = await Application.countDocuments({ freelancerId, status: "pending" });

    const assignedProjects = await Project.countDocuments({ assignedTo: freelancerId });

    res.status(200).json({
      totalApplications,
      acceptedApplications,
      rejectedApplications,
      pendingApplications,
      assignedProjects
    });
  } catch (error) {
    console.error("Error fetching freelancer summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAssignedProjects = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const projects = await Project.find({ assignedTo: freelancerId })
      .select("title description budget status createdAt");

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching assigned projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ freelancerId: req.user._id })
      .populate("projectId", "title budget status")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
