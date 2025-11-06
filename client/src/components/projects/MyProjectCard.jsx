import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "@/services/projectService";

const MyProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    navigate(`/client/update-project/${project._id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteProject(project._id);
      if (onDelete) {
        onDelete(project._id);
      }
      alert("Project deleted successfully!");
    } catch (err) {
      alert(err.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
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
            <span className="font-medium">Posted by:</span> {project.createdBy.name || project.createdBy.email}
          </p>
        </div>
      )}

      <div className="mb-3 text-xs text-gray-400">
        Posted: {new Date(project.createdAt).toLocaleDateString()}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-gray-400"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium text-sm disabled:bg-gray-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyProjectCard;

