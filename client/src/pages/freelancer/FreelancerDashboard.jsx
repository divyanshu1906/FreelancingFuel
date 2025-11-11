import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/projects/ProjectCard";
import {
  getFreelancerSummary,
  getFreelancerProjects,
  getFreelancerApplications,
} from "@/services/freelancerService";
import { getOpenProjects } from "@/services/projectService";

console.log("Loaded ProjectCard component:", ProjectCard); 

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const fetchData = {
    home: async () => await getFreelancerSummary(),
    myProjects: async () => await getFreelancerProjects(),
    myApplications: async () => await getFreelancerApplications(),
    browseProjects: async () => await getOpenProjects(),
  };

  const tabs = {
    home: {
      label: "Dashboard",
      render: (summary) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary ? (
            <>
              <Card title="Total Applications" value={summary.totalApplications} />
              <Card title="Accepted Applications" value={summary.acceptedApplications} />
              <Card title="Rejected Applications" value={summary.rejectedApplications} />
              <Card title="Pending Applications" value={summary.pendingApplications} />
              <Card title="Assigned Projects" value={summary.assignedProjects} />
            </>
          ) : (
            <p>No summary available.</p>
          )}
        </div>
      ),
    },
    myProjects: {
      label: "My Projects",
      render: (projects) => (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Assigned Projects</h2>
          {projects?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No assigned projects yet.</p>
          )}
        </div>
      ),
    },
    myApplications: {
      label: "My Applications",
      render: (applications) => (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Applications</h2>
          {applications?.length ? (
            <div className="space-y-4">
              {applications.map((a) => (
                <div key={a._id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{a.projectId?.title || "N/A"}</h3>
                    <span className={`px-3 py-1 rounded text-sm ${
                      a.status === "accepted" ? "bg-green-100 text-green-800" :
                      a.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    <strong>Project Budget:</strong> ${a.projectId?.budget || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Project Status:</strong> {a.projectId?.status || "N/A"}
                  </p>
                  {a.message && (
                    <p className="text-gray-700 mb-2">
                      <strong>Message:</strong> {a.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Applied: {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No applications yet.</p>
          )}
        </div>
      ),
    },
    browseProjects: {
      label: "Browse Projects",
      render: (projects) => (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Browse Open Projects</h2>
          {projects?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} showApplyButton={true} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No open projects available at the moment.</p>
          )}
        </div>
      ),
    },
  };

  return (
    <div className="relative">
      <DashboardLayout tabs={tabs} fetchData={fetchData} />

      {/* Chats Button - fixed */}
      <button
        onClick={() => navigate("/freelancer/chats")}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h10M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Chats
      </button>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow p-4 rounded">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-2xl">{value}</p>
  </div>
);

export default FreelancerDashboard;
