import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatRoom from "@/components/chat/ChatRoom";
import { logoutUser } from "@/services/authService";

const ClientChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const token = localStorage.getItem("token");

  const fetchChats = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = chats.filter((c) => {
    const title = c.projectId?.title || "";
    const name = c.freelancerId?.name || c.freelancerId?.email || "";
    return (title + " " + name).toLowerCase().includes(query.toLowerCase());
  });

  const handleLogout = async () => {
    try {
      await logoutUser({ token });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r border-gray-200 p-4 overflow-y-auto bg-ff-bg flex flex-col relative">
        <div className="flex items-center justify-between mb-3">
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
              <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-100 rounded shadow z-40">
                <button
                  onClick={() => { setProfileOpen(false); /* view profile - leave as is */ }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  View profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">Chats</h2>
            <p className="text-xs text-gray-500">Project conversations</p>
          </div>
        </div>

        <div className="mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="w-full bg-white border border-gray-200 rounded-full px-3 py-2 text-sm"
          />
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading...</div>
          ) : filtered.length ? (
            <ul className="divide-y divide-gray-100">
              {filtered.map((c) => {
                const pid = c.projectId?._id || c.projectId;
                const last = c.lastMessage || {};
                const name = c.freelancerId?.name || c.freelancerId?.email || "Freelancer";
                const preview = last.message ? last.message.slice(0, 60) : "No messages yet";
                const time = last.createdAt ? new Date(last.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : "";
                const active = String(pid) === String(projectId);
                const unread = c.unreadCount || 0;

                return (
                  <li
                    key={c._id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-all ${active ? 'bg-ff-bg shadow-sm rounded-r' : ''}`}
                    onClick={() => navigate(`/client/chats/${pid}`)}
                  >
                    {active ? <div className="w-1 h-12 bg-ff-accent-dark rounded-r-sm" /> : <div className="w-1 h-12 mr-3" />}

                    <div className="w-12 h-12 rounded-full bg-ff-accent/10 flex items-center justify-center text-ff-accent-dark font-semibold">{(name||'?').charAt(0).toUpperCase()}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="font-medium truncate">{c.projectId?.title || "Project"}</div>
                        <div className="text-xs text-gray-400 ml-2">{time}</div>
                      </div>
                      <div className="text-xs text-gray-500 truncate">{name} · <span className={`${preview === 'No messages yet' ? 'italic text-gray-400' : ''}`}>{preview}</span></div>
                    </div>

                    {unread > 0 && (
                      <div className="ml-2 shrink-0">
                        <div className="bg-ff-accent text-white text-xs px-2 py-0.5 rounded-full">{unread}</div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-ff-accent/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-ff-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
              </div>
              <h3 className="font-semibold">No chats yet</h3>
              <p className="text-sm mt-2">When a freelancer applies or someone messages you, conversations will appear here.</p>
              <div className="mt-4">
                <button onClick={fetchChats} className="px-4 py-2 bg-ff-accent text-white rounded">Refresh</button>
              </div>
            </div>
          )}
        </div>
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
