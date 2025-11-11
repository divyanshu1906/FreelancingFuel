import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatRoom from  "@/components/chat/ChatRoom";

const ClientChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const token =
    localStorage.getItem("client_token") ||
    localStorage.getItem("freelancer_token") ||
    localStorage.getItem("token");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/chat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load chats");
        const data = await res.json();
        setChats(data.chats || []);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Projects</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : chats.length ? (
          <ul className="space-y-2">
            {chats.map((c) => {
              const pid = c.projectId?._id || c.projectId;
              return (
                <li
                  key={c._id}
                  className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                    String(pid) === String(projectId) ? "bg-gray-100" : ""
                  }`}
                  onClick={() => navigate(`/client/chats/${pid}`)}
                >
                  <div className="font-medium">{c.projectId?.title || "Project"}</div>
                  <div className="text-xs text-gray-500">
                    {c.freelancerId?.name || c.freelancerId?.email || "Freelancer"}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No chats yet.</p>
        )}
      </aside>

      <main className="flex-1 p-6">
        {projectId ? (
          <ChatRoom />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">Select a project to open chat</div>
        )}
      </main>
    </div>
  );
};

export default ClientChats;
