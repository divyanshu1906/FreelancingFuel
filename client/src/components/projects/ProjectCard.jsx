import { useNavigate } from "react-router-dom";

const ProjectCard = ({ 
  project, 
  showApplyButton = false, 
  showEditButtons = false,
  onUpdate,
  onDelete 
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(project._id);
    } else {
      navigate(`/client/update-project/${project._id}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      if (onDelete) {
        await onDelete(project._id);
      }
    }
  };

  // 🟢 NEW: Chat with Freelancer button handler
  const handleChat = () => {
    if (!project.status?.toLowerCase().includes("progress")) {
      alert("Chat is available only for in-progress projects.");
      return;
    }
    // Navigate to the shared chat route (works for both client and freelancer)
    navigate(`/chat/${project._id}`);
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{project.description}</p>

      {project.skillsRequired && project.skillsRequired.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Skills Required:</p>
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-green-600">${project.budget}</span>
          {project.deadline && (
            <span className="text-sm text-gray-500">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {project.createdBy && (
        <div className="pt-3 border-t border-gray-200 mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Posted by:</span>{" "}
            {project.createdBy.name || project.createdBy.email}
          </p>
        </div>
      )}

      <div className="mb-3 text-xs text-gray-400">
        Posted: {new Date(project.createdAt).toLocaleDateString()}
      </div>

      {/* Freelancer Apply Button */}
      {showApplyButton && project.status === "open" && (
        <button
          onClick={() => navigate(`/freelancer/apply/${project._id}`)}
          className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Apply to Project
        </button>
      )}

      {/* Client Update/Delete Buttons */}
      {showEditButtons && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpdate}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Delete
          </button>
        </div>
      )}

      {/* 🟢 Chat Button (Visible only when project is in-progress) */}
      {project.status?.toLowerCase().includes("progress") && (
        <div className="mt-3">
          <button
            onClick={handleChat}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            Chat with Freelancer
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
