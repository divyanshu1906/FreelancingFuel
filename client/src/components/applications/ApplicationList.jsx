import { useState, useEffect } from "react";
import { acceptApplication, rejectApplication } from "@/services/applicationService";

const ApplicationList = ({ applications }) => {
  const [processingId, setProcessingId] = useState(null);
  const [updatedApplications, setUpdatedApplications] = useState(applications);

  useEffect(() => {
    setUpdatedApplications(applications);
  }, [applications]);

  const handleAccept = async (applicationId) => {
    setProcessingId(applicationId);
    try {
      const result = await acceptApplication(applicationId);
      // Update the application status in the list
      setUpdatedApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: "accepted" }
            : app
        )
      );
      alert(result.message || "Application accepted successfully!");
    } catch (error) {
      alert(error.message || "Failed to accept application");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId) => {
    setProcessingId(applicationId);
    try {
      const result = await rejectApplication(applicationId);
      // Update the application status in the list
      setUpdatedApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: "rejected" }
            : app
        )
      );
      alert(result.message || "Application rejected successfully!");
    } catch (error) {
      alert(error.message || "Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  const applicationsToShow = updatedApplications.length > 0 ? updatedApplications : applications;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Project Applications</h2>
      {applicationsToShow?.length ? (
        <div className="space-y-4">
          {applicationsToShow.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{a.projectId?.title || "N/A"}</h3>
                  <p className="text-sm text-gray-600">
                    From: {a.freelancerId?.name || "N/A"} ({a.freelancerId?.email || "N/A"})
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    a.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : a.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {a.status}
                </span>
              </div>

              {a.proposalText && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Proposal:</p>
                  <p className="text-gray-700 bg-gray-50 p-2 rounded">{a.proposalText}</p>
                </div>
              )}

              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-600">
                    <strong>Bid Amount:</strong> ${a.bidAmount || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Project Status:</strong> {a.projectId?.status || "N/A"}
                  </p>
                </div>
              </div>

              {a.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(a._id)}
                    disabled={processingId === a._id}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 font-medium"
                  >
                    {processingId === a._id ? "Processing..." : "Accept"}
                  </button>
                  <button
                    onClick={() => handleReject(a._id)}
                    disabled={processingId === a._id}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 font-medium"
                  >
                    {processingId === a._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                Received: {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No applications received yet.</p>
      )}
    </div>
  );
};

export default ApplicationList;

