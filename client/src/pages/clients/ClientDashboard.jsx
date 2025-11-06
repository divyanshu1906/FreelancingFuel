import { useState, useMemo, useCallback } from "react";
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
  const [projects, setProjects] = useState([]);

  const handleDeleteProject = useCallback((projectId) => {
    // Remove the deleted project from the list
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
  }, []);

  const fetchData = useMemo(() => ({
    home: async () => await getClientSummary(user.id),
    myProjects: async () => {
      const data = await getClientProjects();
      setProjects(data);
      return data;
    },
    myApplications: async () => await getClientApplications(),
  }), [user.id]);

  const tabs = {
    home: {
      label: "Home (Summary)",
      render: (summary) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary ? (
            <>
              <Card title="Total Projects" value={summary.totalProjects} />
              <Card title="In Progress" value={summary.inProgress} />
              <Card title="Completed" value={summary.completed} />
              <Card title="Open Projects" value={summary.open} />
              <Card title="Pending Applications" value={summary.pendingApplications} />
            </>
          ) : (
            <p>No summary data.</p>
          )}
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
              <p className="text-gray-500">No projects created yet.</p>
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
      {/* Create Project Button - Fixed position */}
      <button
        onClick={() => navigate("/client/create-project")}
        className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Project
      </button>
      <DashboardLayout tabs={tabs} fetchData={fetchData} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow p-4 rounded">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-2xl">{value}</p>
  </div>
);

export default ClientDashboard;
