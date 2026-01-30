import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./ProjectChatModal.css";

export default function ProjectChatModal({ projectId, userInfo, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState({}); // Manager replies

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/project/${projectId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [projectId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(
        `/api/project/${projectId}/message`,
        { message: text },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err.response?.data?.message || err.message);
    }
  };

  const replyMessage = async (messageId) => {
    if (!replyText[messageId]?.trim()) return;
    try {
      await axios.put(
        `/api/project/${projectId}/message/${messageId}/reply`,
        { reply: replyText[messageId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setReplyText((prev) => ({ ...prev, [messageId]: "" }));
      fetchMessages();
    } catch (err) {
      console.error("Error replying:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Project Chat</h2>

        <div className="chat-box">
          {messages.length === 0 && <p>No messages yet.</p>}
          {messages.map((msg) => (
            <div key={msg._id} className={`message ${msg.sender._id === userInfo.id ? "own" : ""}`}>
              <p><strong>{msg.sender.username}</strong>: {msg.message}</p>
              {msg.reply && <p className="reply"><strong>Manager Reply:</strong> {msg.reply}</p>}
              {!msg.reply && userInfo.role === "Projectmanager" && (
                <div className="reply-input">
                  <input
                    placeholder="Reply..."
                    value={replyText[msg._id] || ""}
                    onChange={(e) => setReplyText(prev => ({ ...prev, [msg._id]: e.target.value }))}
                  />
                  <button onClick={() => replyMessage(msg._id)}>Reply</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="send-box">
          <input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
