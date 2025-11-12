import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { acceptApplication, rejectApplication } from "@/services/applicationService";

const ApplicationList = ({ applications }) => {
  const [processingId, setProcessingId] = useState(null);
  const [updatedApplications, setUpdatedApplications] = useState(applications);
  const navigate = useNavigate();

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

      // After accepting, send an initial message from the client and redirect to chat room
      try {
        const projectId = result.project?._id || result.projectId || result.chat?.projectId;
        // prepare token (support role-specific keys)
        const token =
          localStorage.getItem("client_token") ||
          localStorage.getItem("freelancer_token") ||
          localStorage.getItem("token");

        if (projectId && token) {
          const initialMessage = "Hello — I've accepted your application. Let's discuss the project details here.";
          const sendRes = await fetch(`http://127.0.0.1:3000/api/chat/project/${projectId}/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message: initialMessage }),
          });

          // ignore send failure but log it
          if (!sendRes.ok) {
            const text = await sendRes.text();
            console.error("Initial chat send failed:", sendRes.status, text);
          }

          // navigate to chat room (by project)
          navigate(`/chat/${projectId}`);
        }
      } catch (err) {
        console.error("Error sending initial chat message:", err);
      }
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
            <article key={a._id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-ff-accent-dark truncate">{a.projectId?.title || "N/A"}</h3>
                  <p className="text-sm text-ff-accent-dark/70 mt-1">From <span className="font-medium text-ff-accent-dark">{a.freelancerId?.name || "N/A"}</span> <span className="text-xs text-gray-400">({a.freelancerId?.email || "N/A"})</span></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    a.status === "accepted"
                      ? "bg-green-50 text-green-800 border border-green-100"
                      : a.status === "rejected"
                      ? "bg-red-50 text-red-800 border border-red-100"
                      : "bg-yellow-50 text-yellow-800 border border-yellow-100"
                  }`}
                  >
                    <span className="capitalize">{a.status}</span>
                  </span>
                  <span className="text-xs text-gray-400">Received: {new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {a.proposalText && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-ff-accent-dark mb-2">Proposal</p>
                  <div className="bg-ff-bg p-3 rounded text-sm text-ff-accent-dark">{a.proposalText}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="text-sm text-ff-accent-dark">
                  <p><strong>Bid:</strong> <span className="font-medium">${a.bidAmount || "N/A"}</span></p>
                  <p className="mt-1"><strong>Project status:</strong> <span className="font-medium capitalize">{a.projectId?.status || "N/A"}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(a._id)}
                        disabled={processingId === a._id}
                        className="px-4 py-2 bg-ff-accent text-white rounded hover:opacity-95 disabled:bg-gray-300 font-medium"
                        aria-label={`Accept application from ${a.freelancerId?.name || 'freelancer'}`}
                      >
                        {processingId === a._id ? "Processing..." : "Accept"}
                      </button>
                      <button
                        onClick={() => handleReject(a._id)}
                        disabled={processingId === a._id}
                        className="px-4 py-2 bg-white border border-gray-200 text-ff-accent-dark rounded hover:shadow disabled:bg-gray-100 font-medium"
                        aria-label={`Reject application from ${a.freelancerId?.name || 'freelancer'}`}
                      >
                        {processingId === a._id ? "Processing..." : "Reject"}
                      </button>
                    </>
                  )}

                  {a.status === "accepted" && (
                    <button
                      onClick={() => {
                        const projectId = a.projectId?._id || a.projectId;
                        if (projectId) navigate(`/chat/${projectId}`);
                      }}
                      className="px-4 py-2 bg-ff-accent-dark text-white rounded hover:opacity-90 font-medium"
                      aria-label={`Chat with ${a.freelancerId?.name || 'freelancer'}`}
                    >
                      Chat with Freelancer
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-ff-accent-dark/70">No applications received yet.</p>
      )}
    </div>
  );
};

export default ApplicationList;

