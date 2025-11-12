import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const ChatRoom = ({ projectId: propProjectId }) => {
  const params = useParams();
  const projectId = propProjectId || params.projectId;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatNotFound, setChatNotFound] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // support unified and legacy keys
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("client_token") ||
    localStorage.getItem("freelancer_token");

  const user = JSON.parse(
    localStorage.getItem("user") ||
      localStorage.getItem("client_user") ||
      localStorage.getItem("freelancer_user") ||
      "{}"
  );

  // Fetch messages (and auto-refresh every 3 seconds)
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:3000/api/chat/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          if (res.status === 404) {
            if (isMounted) {
              setChatNotFound(true);
              setMessages([]);
            }
            return;
          }
          throw new Error("Failed to fetch messages");
        }

        const data = await res.json();
        if (isMounted) {
          setChatNotFound(false);
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Error fetching chat:", err);
      }
    };

    // Initial fetch
    fetchMessages();

    // 🕒 Auto-refresh every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    // Cleanup when component unmounts or project changes
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [projectId, token]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:3000/api/chat/project/${projectId}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Send failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const focusInput = () => inputRef.current && inputRef.current.focus();

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-ff-bg shadow-lg rounded-lg flex flex-col h-[80vh]">
      <div className="p-4 border-b border-gray-200 bg-ff-accent-dark text-white rounded-t-lg flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Project Chat</h2>
          <p className="text-xs text-ff-accent">Project ID: {projectId}</p>
        </div>
        <div className="text-sm text-white/80">{messages.length} messages</div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {chatNotFound || messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            {/* simple illustration */}
            <div className="w-40 h-40 rounded-full bg-ff-accent/10 flex items-center justify-center">
              <svg className="w-20 h-20 text-ff-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-ff-accent-dark">No messages yet</h3>
            <p className="text-sm text-ff-accent-dark/70 max-w-xl">Start the conversation with the freelancer or client. Your messages will appear here in real time.</p>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={focusInput} className="px-4 py-2 bg-ff-accent text-white rounded shadow">Send your first message</button>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white border border-gray-200 text-ff-accent-dark rounded">Refresh</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId?._id === user.id;
              const senderName = msg.senderId?.name || msg.senderId?.email || (msg.senderId?._id === user.id ? "You" : "User");

              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="mr-3 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-ff-accent/10 flex items-center justify-center text-ff-accent-dark text-xs">{(senderName || '?').charAt(0).toUpperCase()}</div>
                    </div>
                  )}

                  <div className={`max-w-[70%] p-3 rounded-lg shadow ${isMe ? 'bg-ff-accent-dark text-white rounded-br-none' : 'bg-white text-ff-accent-dark border border-gray-100 rounded-bl-none'}`}>
                    {!isMe && <div className="text-xs font-medium text-ff-accent-dark/80 mb-1">{senderName}</div>}
                    <div className="text-sm wrap-break-word">{msg.message}</div>
                    <div className={`text-[10px] mt-2 ${isMe ? 'text-white/80' : 'text-gray-400'} text-right`}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-ff-bg flex items-center gap-2">
        <button className="p-2 rounded-full text-ff-accent-dark hover:bg-gray-100" title="Emoji">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.657 0"/><circle cx={12} cy={12} r={10} /></svg>
        </button>

        <button className="p-2 rounded-full text-ff-accent-dark hover:bg-gray-100" title="Attach">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.44 11.05l-9.19 9.19a6 6 0 11-8.49-8.49l8.49-8.49a4 4 0 115.66 5.66L9.5 17.5a2 2 0 01-2.83 0"/></svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ff-accent"
        />

        <button onClick={handleSend} className="bg-ff-accent-dark text-white px-5 py-2 rounded-full hover:opacity-90 transition" aria-label="Send message">Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
