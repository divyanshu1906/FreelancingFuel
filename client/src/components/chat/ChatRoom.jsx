import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const ChatRoom = ({ projectId: propProjectId }) => {
  const params = useParams();
  const projectId = propProjectId || params.projectId;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatNotFound, setChatNotFound] = useState(false);
  const containerRef = useRef(null);

  const token =
    localStorage.getItem("client_token") ||
    localStorage.getItem("freelancer_token") ||
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("client_user") ||
      localStorage.getItem("freelancer_user") ||
      localStorage.getItem("user") ||
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

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg flex flex-col h-[80vh]">
      <div className="p-4 border-b border-gray-200 bg-indigo-600 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Chat Room</h2>
        <p className="text-xs text-indigo-200">
          Project ID: {projectId}
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {chatNotFound ? (
          <p className="text-sm text-gray-500 text-center mt-10">
            No chat found for this project yet.
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId?._id === user.id;
            const isFreelancer = msg.senderId?.role === "freelancer";

            return (
              <div
                key={msg._id}
                className={`flex mb-3 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg shadow ${
                    isMe
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe ? "text-green-100" : "text-gray-400"
                    } text-right`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
