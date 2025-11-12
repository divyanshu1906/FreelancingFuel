import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import {
  getFreelancerSummary,
  getFreelancerProjects,
  getFreelancerApplications,
} from "@/services/freelancerService";
import { getOpenProjects } from "@/services/projectService";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const fetchData = {
    home: async () => await getFreelancerSummary(),
    myProjects: async () => await getFreelancerProjects(),
    myApplications: async () => await getFreelancerApplications(),
    browseProjects: async () => await getOpenProjects(),
  };

  const tabs = {
    home: {
      label: "Overview",
      render: (summary) => (
        <div className="space-y-6">
          <div className="bg-ff-bg rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, Freelancer 👋</h1>
                <p className="mt-1 text-sm text-ff-accent-dark">Quick snapshot of your activity</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/freelancer/chats')}
                  className="inline-flex items-center gap-2 bg-ff-accent-dark text-white px-4 py-2 rounded-md shadow hover:opacity-95 transition"
                >
                  Chats
                </button>
                <button
                  onClick={() => navigate('/freelancer/browse')}
                  className="inline-flex items-center gap-2 bg-ff-accent text-white px-4 py-2 rounded-md shadow hover:opacity-95 transition"
                >
                  Browse Projects
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Total Applications" value={summary?.totalApplications ?? 0} icon="📨" />
            <StatCard title="Accepted" value={summary?.acceptedApplications ?? 0} icon="✅" />
            <StatCard title="Rejected" value={summary?.rejectedApplications ?? 0} icon="❌" />
            <StatCard title="Pending" value={summary?.pendingApplications ?? 0} icon="⏳" />
            <StatCard title="Assigned" value={summary?.assignedProjects ?? 0} icon="📁" />
          </div>
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
            <p className="text-ff-accent-dark/70">No assigned projects yet.</p>
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
                <article key={a._id} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-ff-accent-dark truncate">{a.projectId?.title || "N/A"}</h3>
                    <span className={`px-3 py-1 rounded text-sm ${
                      a.status === "accepted" ? "bg-green-50 text-green-800 border border-green-100" :
                      a.status === "rejected" ? "bg-red-50 text-red-800 border border-red-100" :
                      "bg-yellow-50 text-yellow-800 border border-yellow-100"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-ff-accent-dark mb-2">
                    <strong>Project Budget:</strong> <span className="font-medium">${a.projectId?.budget || "N/A"}</span>
                  </p>
                  <p className="text-ff-accent-dark mb-2">
                    <strong>Project Status:</strong> <span className="font-medium capitalize">{a.projectId?.status || "N/A"}</span>
                  </p>
                  {a.message && (
                    <p className="text-ff-accent-dark mb-2">
                      <strong>Message:</strong> {a.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Applied: {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-ff-accent-dark/70">No applications yet.</p>
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
            <p className="text-ff-accent-dark/70">No open projects available at the moment.</p>
          )}
        </div>
      ),
    },
  };

  return (
    <div className="relative">
      <div className="px-4 py-3 border-b border-gray-100 bg-ff-bg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2
              onClick={() => navigate('/dashboard')}
              className="text-lg font-semibold cursor-pointer hover:underline"
              role="button"
              aria-label="Go to dashboard"
            >
              Dashboard
            </h2>
          </div>
          <div className="relative">
            <button
              onClick={() => setProfileOpen((s) => !s)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm flex items-center gap-2 hover:shadow"
            >
              Profile
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8l4 4 4-4" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded shadow z-40">
                <button
                  onClick={() => { setProfileOpen(false); /* view profile - left as-is */ }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  View profile
                </button>
                <button
                  onClick={async () => {
                    try { await (await import("@/services/authService")).logoutUser(); } catch (e) { console.error(e); }
                    navigate('/');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DashboardLayout tabs={tabs} fetchData={fetchData} />

      {/* Chats Button - fixed */}
      <button
        onClick={() => navigate("/freelancer/chats")}
        className="fixed bottom-6 right-6 z-50 bg-ff-accent-dark text-white px-5 py-3 rounded-full shadow-lg hover:opacity-90 transition-colors flex items-center gap-2 font-medium"
        aria-label="Open chats"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h10M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Chats
      </button>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-linear-to-br from-white/50 to-white/30 border border-gray-100 rounded-lg p-4 shadow-sm flex items-center gap-4">
    <div className="text-3xl bg-ff-accent/10 text-ff-accent-dark p-3 rounded-md">{icon}</div>
    <div>
      <div className="text-sm text-ff-accent-dark">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);

export default FreelancerDashboard;
