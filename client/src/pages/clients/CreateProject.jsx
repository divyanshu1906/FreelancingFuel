import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "@/services/projectService";

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    budget: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillsChange = (e) => {
    // Keep the raw string while the user is typing so commas are preserved.
    // We'll parse into an array on submit.
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
        skillsRequired:
          typeof formData.skillsRequired === "string"
            ? formData.skillsRequired.split(",").map((s) => s.trim()).filter((s) => s)
            : formData.skillsRequired,
        budget: Number(formData.budget),
        deadline: formData.deadline || undefined,
      };

      const result = await createProject(projectData);
      setSuccess(result.message || "Project created successfully!");
      // Reset form
      setFormData({
        title: "",
        description: "",
        skillsRequired: "",
        budget: "",
        deadline: "",
      });
      setTimeout(() => {
        navigate("/client/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      skillsRequired: "",
      budget: "",
      deadline: "",
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-ff-bg py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ff-accent-dark">Create New Project</h1>
              <p className="text-sm text-ff-accent-dark/70 mt-1">Fill the details below to post a new project and attract qualified freelancers.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/client/dashboard")}
                className="px-4 py-2 bg-ff-accent text-white border border-gray-200 rounded hover:shadow transition"
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
                value={
                  Array.isArray(formData.skillsRequired)
                    ? formData.skillsRequired.join(", ")
                    : formData.skillsRequired
                }
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

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-ff-accent text-white rounded shadow hover:opacity-95 disabled:bg-gray-300 font-medium transition-transform hover:-translate-y-0.5"
                aria-label="Create project"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-white border border-gray-200 text-ff-accent-dark rounded hover:shadow font-medium"
                aria-label="Reset form"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;

