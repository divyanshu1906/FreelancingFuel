import Application from '../models/application.model.js';
import Project from '../models/project.model.js';

export const applyToProject = async (req, res) => {
  try {
    const { projectId, proposalText, bidAmount } = req.body;
    const freelancerId = req.user._id; // ✅ comes from token, not body

    if (!projectId || !proposalText || !bidAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingApplication = await Application.findOne({
      projectId,
      freelancerId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this project",
      });
    } 
    const application = new Application({
      projectId,
      freelancerId,
      proposalText,
      bidAmount,
      status: "pending",
    });

    await application.save(); // ✅ this actually stores it in MongoDB

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error while applying:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get application by logged in developer
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ freelancerId: req.user._id })
      .populate("projectId", "title budget status")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//client view all applications for their project
export const getProjectApplications = async (req, res) => {
    try {
        const { projectId } = req.params;
        const applications = await Application.find({ projectId })
            .populate("freelancerId", "name email")
            .sort({ createdAt: -1 });
        
        return res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

//client can accept/reject the application
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!["accepted", "rejected"].includes(status)){
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const application = await Application.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );
        res.status(200).json({
            message: `Application ${status} successfully`,
            application,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });  
    }
};

export const acceptApplication = async (req, res) => {
  try {
    const { id } = req.params; 
    
    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "accepted";
    await application.save();

    const project = await Project.findById(application.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = "in-progress";
    project.assignedTo = application.freelancerId;
    await project.save();

    res.json({
      message: "Freelancer successfully assigned to the project!",
      project,
      application
    });
  } catch (error) {
    console.error("Error accepting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params; 

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // If already accepted, prevent rejection
    if (application.status === "accepted") {
      return res.status(400).json({ message: "Cannot reject an already accepted application" });
    }

    application.status = "rejected";
    await application.save();

    res.json({
      message: "Application has been rejected successfully",
      application
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};
