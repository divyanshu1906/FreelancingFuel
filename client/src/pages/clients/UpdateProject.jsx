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
            : "",
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
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Update Project</h1>
            <button
              onClick={() => navigate("/client/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Required (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skillsRequired}
                onChange={handleSkillsChange}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? "Updating..." : "Update Project"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/client/dashboard")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
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

