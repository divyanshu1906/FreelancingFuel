import { useState, useMemo, useCallback, useEffect } from "react";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MyProjectCard from "@/components/projects/MyProjectCard";
import ApplicationList from "@/components/applications/ApplicationList";
import {
  getClientSummary,
  getClientProjects,
  getClientApplications,
} from "@/services/clientService";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [profileOpen, setProfileOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleDeleteProject = useCallback((projectId) => {
    // Remove the deleted project from the list
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
  }, []);

  // Fetch summary on mount for hero
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getClientSummary(user.id);
        if (mounted) setSummary(s);
      } catch (err) {
        // fail silently; DashboardLayout will show fallback
        console.error("Failed to load client summary", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  const fetchData = useMemo(() => ({
    home: async () => summary || (await getClientSummary(user.id)),
    myProjects: async () => {
      const data = await getClientProjects();
      setProjects(data);
      return data;
    },
    myApplications: async () => await getClientApplications(),
  }), [user.id, summary]);

  const tabs = {
    home: {
      label: "Overview",
      render: (summaryData) => (
        <div className="space-y-6">
          <div className="bg-ff-bg rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name || "Client"} 👋</h1>
                <p className="mt-1 text-sm text-ff-accent-dark">Here's a quick summary of your account</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/client/create-project')}
                  className="inline-flex items-center gap-2 bg-ff-accent text-white px-4 py-2 rounded-md shadow hover:opacity-95 transform hover:-translate-y-0.5 transition"
                  aria-label="Create project"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Project
                </button>
                <button
                  onClick={() => navigate('/client/chats')}
                  className="inline-flex items-center gap-2 bg-ff-accent-dark text-white px-4 py-2 rounded-md shadow hover:opacity-95 transform hover:-translate-y-0.5 transition"
                  aria-label="Open chats"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6" />
                  </svg>
                  Chats
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Total Projects" value={summaryData?.totalProjects ?? summary?.totalProjects ?? 0} icon="📁" />
            <StatCard title="In Progress" value={summaryData?.inProgress ?? summary?.inProgress ?? 0} icon="🚧" />
            <StatCard title="Completed" value={summaryData?.completed ?? summary?.completed ?? 0} icon="✅" />
            <StatCard title="Open" value={summaryData?.open ?? summary?.open ?? 0} icon="🟢" />
            <StatCard title="Pending Apps" value={summaryData?.pendingApplications ?? summary?.pendingApplications ?? 0} icon="🕒" />
          </div>
        </div>
      ),
    },
    myProjects: {
      label: "My Projects",
      render: (projectsData) => {
        // Use projects state if available, otherwise use fetched data
        const projectsToShow = Array.isArray(projects) && projects.length > 0
          ? projects
          : (Array.isArray(projectsData) ? projectsData : []);

        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
            {projectsToShow && projectsToShow.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectsToShow.map((project) => (
                  <MyProjectCard
                    key={project._id}
                    project={project}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-ff-bg p-6 rounded shadow text-center">
                <p className="text-ff-accent-dark mb-4">You haven't created any projects yet.</p>
                <button
                  onClick={() => navigate('/client/create-project')}
                  className="bg-ff-accent text-white px-4 py-2 rounded shadow hover:opacity-95"
                >
                  Create your first project
                </button>
              </div>
            )}
          </div>
        );
      },
    },
    myApplications: {
      label: "My Applications",
      render: (applications) => (
        <ApplicationList applications={applications || []} />
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
                    try { await logoutUser(); } catch (e) { console.error(e); }
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

      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => navigate('/client/chats')}
          aria-label="Open chats"
          className="flex items-center gap-2 bg-white text-ff-accent-dark px-4 py-3 rounded-full shadow-lg hover:scale-105 transform transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h10" />
          </svg>
          Chats
        </button>

        <button
          onClick={() => navigate('/client/create-project')}
          aria-label="Create project"
          className="flex items-center gap-2 bg-ff-accent text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transform transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create
        </button>
      </div>
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

export default ClientDashboard;
