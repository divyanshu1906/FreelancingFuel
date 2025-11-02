import { useEffect, useState } from "react";
import axios from "axios";

const FreelancerDashboard = () => {
    
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // from login response

        const res = await axios.get(
          "http://localhost:3000/api/freelancer/summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching freelancer summary:", error);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) return <p>Loading freelancer dashboard...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Total Applications</h2>
        <p className="text-2xl">{summary.totalApplications}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Accepted Applications</h2>
        <p className="text-2xl">{summary.acceptedApplications}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Rejected Applications</h2>
        <p className="text-2xl">{summary.rejectedApplications}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Pending Applications</h2>
        <p className="text-2xl">{summary.pendingApplications}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Assigned Projects</h2>
        <p className="text-2xl">{summary.assignedProjects}</p>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
