import { useNavigate } from "react-router-dom";

const ProjectCard = ({ 
  project, 
  showApplyButton = false, 
  showEditButtons = false,
  onUpdate,
  onDelete 
}) => {
  const navigate = useNavigate();

  const getStatusClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-800 border border-green-100";
      case "in-progress":
        return "bg-ff-accent/10 text-ff-accent-dark border border-ff-accent/20";
      case "open":
        return "bg-yellow-50 text-yellow-800 border border-yellow-100";
      default:
        return "bg-gray-50 text-gray-800 border border-gray-100";
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

  const handleChat = () => {
    if (!project.status?.toLowerCase().includes("progress")) {
      alert("Chat is available only for in-progress projects.");
      return;
    }
    navigate(`/chat/${project._id}`);
  };

  return (
    <article className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition">
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ff-accent-dark truncate">{project.title}</h3>
          <div className="mt-1 text-sm text-ff-accent-dark/70 flex items-center gap-3">
            <span className="font-medium text-ff-accent-dark">${project.budget}</span>
            {project.deadline && (
              <span className="text-xs text-gray-400">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(project.status)}`}>
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
            <span className="font-medium">Posted by:</span>{" "}
            {project.createdBy.name || project.createdBy.email}
          </p>
        </div>
      )}

      <footer className="mt-3">
        {showApplyButton && project.status === "open" && (
          <button
            onClick={() => navigate(`/freelancer/apply/${project._id}`)}
            className="w-full mt-2 px-6 py-3 bg-ff-accent-dark text-white rounded hover:opacity-95 transition-colors font-medium"
            aria-label={`Apply to ${project.title}`}
          >
            Apply to Project
          </button>
        )}

        {showEditButtons && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 bg-ff-accent text-white rounded hover:opacity-95 transition-transform hover:-translate-y-0.5 font-medium text-sm"
              aria-label={`Update ${project.title}`}
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 text-white rounded font-medium text-sm disabled:opacity-60"
              style={{ backgroundColor: '#f87060' }}
              aria-label={`Delete ${project.title}`}
            >
              Delete
            </button>
          </div>
        )}

        {project.status?.toLowerCase().includes("progress") && (
          <div className="mt-3">
            <button
              onClick={handleChat}
              className="w-full px-4 py-2 bg-ff-accent-dark text-white rounded hover:opacity-95 transition-colors font-medium text-sm"
              aria-label={`Chat about ${project.title}`}
            >
              Chat with Client
            </button>
          </div>
        )}
      </footer>
    </article>
  );
};

export default ProjectCard;
