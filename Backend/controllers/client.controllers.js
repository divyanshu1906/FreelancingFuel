import Project from "../models/project.model.js";
import Application from "../models/application.model.js";

//Get Project by Client
export const getClientSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const projects = await Project.find({createdBy: id});

    const totalProjects = projects.length;
    const inProgress = projects.filter(p => p.status == 'in-progress').length;
    const completed = projects.filter(p => p.status === "completed").length;
    const open = projects.filter(p => p.status === "open").length

    //find applications for these projects
    const projectIds = projects.map(p => p._id);
    const pendingApplications = await Application.countDocuments({
      projectId: { $in: projectIds },
      status: "pending"
    });

    res.status(200).json({
      totalProjects,
      inProgress,
      completed,
      open,
      pendingApplications,
    });
  } catch (error) {
    console.error("Error fetching client summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all projects created by a specific client
export const getClientProjects = async (req, res) => {
  try {
    const clientId = req.user._id;

    const { status } = req.query; // optional filter: ?status=open

    const query = { createdBy: clientId };
    if (status) query.status = status;

    const projects = await Project.find(query).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching client projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all applications received on the client’s projects
export const getClientApplications = async (req, res) => {
  try {
    const clientId = req.user._id;

    // get all project IDs created by the client
    const clientProjects = await Project.find({ createdBy: clientId }).select("_id");

    const projectIds = clientProjects.map(p => p._id);

    // fetch applications for those projects
    const applications = await Application.find({ projectId: { $in: projectIds } })
      .populate("freelancerId", "name email")
      .populate("projectId", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching client applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

