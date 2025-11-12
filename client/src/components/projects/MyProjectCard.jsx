import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "@/services/projectService";

const MyProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getStatusClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-800 border-green-100";
      case "in-progress":
        return "bg-ff-accent/10 text-ff-accent-dark border-ff-accent/20";
      case "open":
        return "bg-yellow-50 text-yellow-800 border-yellow-100";
      default:
        return "bg-gray-50 text-gray-800 border-gray-100";
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
      if (onDelete) onDelete(project._id);
      // small inline success feedback
      // replace alert with nicer UI later if desired
      alert("Project deleted successfully!");
    } catch (err) {
      alert(err.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white shadow-md hover:shadow-lg rounded-lg p-5 transition-shadow border border-gray-100">
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ff-accent-dark truncate">{project.title}</h3>
          <div className="mt-1 text-sm text-ff-accent-dark/70 flex items-center gap-3">
            <span className="font-medium text-ff-accent-dark">${project.budget}</span>
            {project.deadline && (
              <span className="text-xs text-gray-500">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusClasses(project.status)}`}>
            <span className="capitalize">{project.status}</span>
          </span>
          <span className="text-xs text-gray-400">Posted: {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      <p className="text-sm text-ff-accent-dark mb-4 line-clamp-3">{project.description}</p>

      {project.skillsRequired && project.skillsRequired.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-ff-accent-dark mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-ff-bg border border-ff-accent/10 text-ff-accent-dark rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.createdBy && (
        <div className="pt-3 border-t border-gray-100 mb-3">
          <p className="text-sm text-ff-accent-dark">
            <span className="font-medium">Posted by:</span> {project.createdBy.name || project.createdBy.email}
          </p>
        </div>
      )}

      <footer className="flex gap-3 mt-4">
        <button
          onClick={handleUpdate}
          disabled={loading}
          aria-label={`Update ${project.title}`}
          className="flex-1 px-4 py-2 bg-ff-accent text-white rounded hover:opacity-95 transition-transform hover:-translate-y-0.5 font-medium text-sm disabled:opacity-60"
        >
          Update
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          aria-label={`Delete ${project.title}`}
          className="flex-1 px-4 py-2 text-white rounded font-medium text-sm disabled:opacity-60"
          style={{ backgroundColor: '#f87060' }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </footer>
    </article>
  );
};

export default MyProjectCard;

