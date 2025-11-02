import { useEffect, useState } from "react";
import axios from "axios";

const ClientDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // from login response

        const res = await axios.get(
          `http://localhost:3000/api/client/summary/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Total Projects</h2>
        <p className="text-2xl">{summary.totalProjects}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">In Progress</h2>
        <p className="text-2xl">{summary.inProgress}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Completed</h2>
        <p className="text-2xl">{summary.completed}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Open Projects</h2>
        <p className="text-2xl">{summary.open}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Pending Applications</h2>
        <p className="text-2xl">{summary.pendingApplications}</p>
      </div>
    </div>
  );
};

export default ClientDashboard;
