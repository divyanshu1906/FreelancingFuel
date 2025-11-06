import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applyToProject } from "@/services/applicationService";
import { getProjectById } from "@/services/projectService";

const ApplyApplication = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    proposalText: "",
    bidAmount: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        setProject(data);
      } catch (err) {
        setError("Failed to load project details");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const applicationData = {
        projectId: projectId,
        proposalText: formData.proposalText,
        bidAmount: Number(formData.bidAmount),
      };

      const result = await applyToProject(applicationData);
      setSuccess(result.message || "Application submitted successfully!");
      
      setTimeout(() => {
        navigate("/freelancer/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Apply to Project</h1>
            <button
              onClick={() => navigate("/freelancer/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Project Details */}
          {project && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="font-semibold">Budget: ${project.budget}</span>
                {project.deadline && (
                  <span className="font-semibold">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              {project.skillsRequired && project.skillsRequired.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-semibold">Skills Required: </span>
                  <span className="text-sm">
                    {project.skillsRequired.join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}

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

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposal Text <span className="text-red-500">*</span>
              </label>
              <textarea
                name="proposalText"
                value={formData.proposalText}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Write your proposal explaining why you're the right fit for this project..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Bid Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bidAmount"
                value={formData.bidAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter your bid amount"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {project && (
                <p className="text-xs text-gray-500 mt-1">
                  Project budget: ${project.budget}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/freelancer/dashboard")}
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

export default ApplyApplication;

