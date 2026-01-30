import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTaskById } from "../store/taskSlice";
import { fetchMessagesByTask, sendMessage } from "../store/taskMessageSlice";
import { toast } from "react-toastify";
import "../../public/css/TaskDetails.css";

const formatDateDMY = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentTask: task, loading: taskLoading, error: taskError } =
    useSelector((state) => state.task);
  const { list: messages } = useSelector((state) => state.taskMessage);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [text, setText] = useState("");
  const [replyMessage, setReplyMessage] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
      dispatch(fetchMessagesByTask(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (taskError) toast.error(taskError);
  }, [taskError]);

  const handleSend = () => {
    if (!text.trim()) return;
    dispatch(sendMessage({ text, taskId: id, replyTo: replyMessage?._id }));
    setText("");
    setReplyMessage(null);
  };

  if (taskLoading || !task) return <p className="loader">Loading...</p>;

  return (
    <div className="task-details-wrapper">

      {/* ===== TOP BAR ===== */}
      <div className="task-top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back Task
        </button>
        <h4>Task Details</h4>
      </div>

      {/* ===== TASK CARD ===== */}
      <div className="task-details-card">
        <h2 className="task-title">{task.title}</h2>

        <div className="task-info">
          <p><strong>Description:</strong> {task.description || "-"}</p>
          <p><strong>Estimated Days:</strong> {task.estimatedDays || "-"}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo?.map(u => u.username).join(", ") || "Not assigned"}</p>
          <p><strong>Assigned By:</strong> {task.assignedBy?.username || "Not assigned"}</p>
          <p><strong>Start Date:</strong> {formatDateDMY(task.startDate)}</p>
          <p><strong>End Date:</strong> {formatDateDMY(task.endDate)}</p>
        </div>
      </div>

      {/* ===== CHAT ===== */}
      <div className="task-chat-card">
        <div className="chat-header">💬 Task Messages</div>

        <div className="chat-box">
          {messages.map((msg) => {
            const isOwn = msg.sender?._id === loggedInUser?._id;
            return (
              <div key={msg._id} className={`chat-message ${isOwn ? "own" : "other"}`}>
                {msg.replyTo && (
                  <div className="reply-preview">
                    <strong>{msg.replyTo.sender?.username}</strong>: {msg.replyTo.text}
                  </div>
                )}

                <div className="msg-header">
                  <span className="user">{isOwn ? "You" : msg.sender?.username}</span>
                  <span className="time">{formatTime(msg.createdAt)}</span>
                </div>

                <div className="msg-text">{msg.text}</div>

                <button className="reply-btn" onClick={() => setReplyMessage(msg)}>
                  Reply
                </button>
              </div>
            );
          })}
        </div>

        {replyMessage && (
          <div className="replying">
            <span>Replying to {replyMessage.sender?.username}: {replyMessage.text}</span>
            <button onClick={() => setReplyMessage(null)}>✕</button>
          </div>
        )}

        <div className="input-box">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
