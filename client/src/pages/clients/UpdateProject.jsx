import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateProject, getProjectById } from "@/services/projectService";

const UpdateProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    budget: "",
    deadline: "",
    status: "open",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProjectById(projectId);
        setFormData({
          title: project.title || "",
          description: project.description || "",
          skillsRequired: Array.isArray(project.skillsRequired)
            ? project.skillsRequired.join(", ")
            : project.skillsRequired || "",
          budget: project.budget || "",
          deadline: project.deadline
            ? new Date(project.deadline).toISOString().split("T")[0]
            : "",
          status: project.status || "open",
        });
      } catch (err) {
        setError("Failed to load project details");
      } finally {
        setLoadingProject(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillsChange = (e) => {
    setFormData({
      ...formData,
      skillsRequired: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        budget: Number(formData.budget),
        deadline: formData.deadline || undefined,
        status: formData.status,
      };

      const result = await updateProject(projectId, projectData);
      setSuccess(result.message || "Project updated successfully!");

      setTimeout(() => {
        navigate("/client/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-ff-bg py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-ff-accent/30 border-t-ff-accent mx-auto mb-4" />
          <p className="text-ff-accent-dark">Loading project…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ff-bg py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ff-accent-dark">Update Project</h1>
              <p className="text-sm text-ff-accent-dark/70 mt-1">Edit project details and publish updates to your freelancers.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/client/dashboard")}
                className="px-4 py-2 bg-ff-accent text-white border border border-gray-200 rounded hover:shadow transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              <strong className="block font-medium">Error</strong>
              <div className="mt-1 text-sm">{error}</div>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-ff-accent/10 border border-ff-accent/20 text-ff-accent-dark rounded">
              <strong className="block font-medium">Success</strong>
              <div className="mt-1 text-sm">{success}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ff-accent-dark mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
                aria-label="Project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ff-accent-dark mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
                aria-label="Project description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ff-accent-dark mb-1">
                Skills Required (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skillsRequired}
                onChange={handleSkillsChange}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
                aria-label="Skills required"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ff-accent-dark mb-1">
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
                  aria-label="Project budget"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ff-accent-dark mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
                  aria-label="Project deadline"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ff-accent-dark mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-ff-accent text-white rounded shadow hover:opacity-95 disabled:bg-gray-300 font-medium transition-transform hover:-translate-y-0.5"
              >
                {loading ? "Updating..." : "Update Project"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/client/dashboard")}
                className="px-6 py-3 bg-white border border-gray-200 text-ff-accent-dark rounded hover:shadow font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;

