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
    <div className="min-h-screen bg-ff-bg py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ff-accent-dark">Apply to Project</h1>
              <p className="text-sm text-ff-accent-dark/70 mt-1">Send a tailored proposal and bid to win this project.</p>
            </div>
            <div>
              <button
                onClick={() => navigate("/freelancer/dashboard")}
                className="px-4 py-2 bg-white text-ff-accent-dark border border-gray-200 rounded hover:shadow transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Project Details */}
          {project && (
            <div className="mb-6 p-4 bg-ff-bg border border-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-ff-accent-dark">{project.title}</h2>
              <p className="text-ff-accent-dark mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-ff-accent-dark">
                <span className="font-semibold">Budget: ${project.budget}</span>
                {project.deadline && (
                  <span className="font-semibold">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              {project.skillsRequired && project.skillsRequired.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-ff-accent-dark mb-2">Skills Required</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsRequired.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-ff-bg border border-ff-accent/10 text-ff-accent-dark rounded-md text-sm">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ff-accent-dark mb-1">
                Proposal Text <span className="text-red-500">*</span>
              </label>
              <textarea
                name="proposalText"
                value={formData.proposalText}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Write your proposal explaining why you're the right fit for this project..."
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
                aria-label="Proposal text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ff-accent-dark mb-1">
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
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-ff-accent"
                aria-label="Bid amount"
              />
              {project && (
                <p className="text-xs text-ff-accent-dark/70 mt-1">
                  Project budget: ${project.budget}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-ff-accent text-white rounded shadow hover:opacity-95 disabled:bg-gray-300 font-medium transition-transform hover:-translate-y-0.5"
                aria-label="Submit application"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/freelancer/dashboard")}
                className="px-6 py-3 bg-white border border-gray-200 text-ff-accent-dark rounded hover:shadow font-medium"
                aria-label="Cancel"
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

