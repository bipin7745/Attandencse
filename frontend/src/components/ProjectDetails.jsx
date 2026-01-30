import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../store/projectSlice";
import { fetchTasksByProject, createTask } from "../store/taskSlice";
import { fetchMessagesByProject, sendMessage } from "../store/messageSlice";
import { toast } from "react-toastify";
import { formatDateDMY } from "../utils/Date";
import TaskModal from "./TaskModal";
import TaskList from "./TaskList";
import "../../public/css/ProjectDetails.css";


/* ================= REMAINING DAYS CALC ================= */
const calculateRemainingDays = (createdAt, estimatedDays) => {
  if (!createdAt || !estimatedDays) return 0;
  const createdDate = new Date(createdAt);
  const today = new Date();
  const elapsedTime = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
  const remaining = estimatedDays - elapsedTime;
  return remaining >= 0 ? remaining : 0;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const {
    currentProject: project,
    loading: projectLoading,
    error: projectError,
  } = useSelector((state) => state.project);
  const { list: tasks, loading: tasksLoading } = useSelector(
    (state) => state.task
  );
  const { list: messages, loading: messagesLoading } = useSelector(
    (state) => state.message
  );

  const [text, setText] = useState("");
  const [replyMessage, setReplyMessage] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
      dispatch(fetchTasksByProject(id));
      dispatch(fetchMessagesByProject(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (projectError) toast.error(projectError);
  }, [projectError]);

  const handleSend = () => {
    if (!text.trim()) return;

    dispatch(
      sendMessage({
        text,
        projectId: id,
        replyTo: replyMessage?._id,
      })
    );

    setText("");
    setReplyMessage(null);
  };

  const handleTaskCreated = () => {
    setShowTaskModal(false);
    dispatch(fetchProjectById(id));
    dispatch(fetchTasksByProject(id));
  };

  const startDate = project?.createdAt ? new Date(project.createdAt) : null;
  const endDate = startDate
    ? new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + Number(project?.estimatedDays || 0)
      )
    : null;

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (projectLoading || !project) return <p className="loader">Loading...</p>;

  return (
    <div className="pd-wrapper">
      <div className="pd-top-bar">
        <button className="pd-back-btn" onClick={() => navigate(-1)}>
          ← Back to Projects
        </button>
        <h2>Project Details</h2>
      </div>

      <div className="pd-project-card">
        <div className="pd-header">
          <h2>{project.projectName}</h2>
        </div>
        <p className="pd-desc">{project.projectDescription}</p>
        <div className="pd-info-grid">
          <div className="pd-info">
            <strong>Project Manager</strong>
            <p>{project.assignedProjectManager?.username || "Not Assigned"}</p>
          </div>
          <div className="pd-info">
            <strong>Employees</strong>
            <p>
              {project.assignedEmployees?.length
                ? project.assignedEmployees.map((e) => e.username).join(", ")
                : "None"}
            </p>
          </div>
          <div className="pd-info">
            <strong>Estimated Days</strong>
            <p>{project.estimatedDays}</p>
          </div>
          <div className="pd-info">
            <strong>Start Date</strong>
            <p>{formatDateDMY(startDate)}</p>
          </div>
          <div className="pd-info">
            <strong>End Date</strong>
            <p>{formatDateDMY(endDate)}</p>
          </div>
        </div>
      </div>

      {(loggedInUser.role === "admin" ||
        loggedInUser.role === "projectmanager") && (
        <button
          className="assign-task-btn"
          onClick={() => setShowTaskModal(true)}
        >
          + Assign Task
        </button>
      )}

      <TaskModal
        show={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projectId={project._id}
        employees={project.assignedEmployees || []}
        projectStartDate={project?.createdAt}
        projectEstimatedDays={project?.estimatedDays}
        onTaskCreated={handleTaskCreated}
      />

      <TaskList projectId={project._id} />

      <div className="pd-chat-card">
        <div className="pd-chat-header">💬 Project Chat</div>
        <div className="pd-chat-box">
          {messages.map((msg) => {
            const isOwn = msg.sender?._id === loggedInUser?._id;
            return (
              <div
                key={msg._id}
                className={`pd-message ${isOwn ? "pd-own" : "pd-other"}`}
              >
                {msg.replyTo && (
                  <div className="pd-reply-preview">
                    <strong>{msg.replyTo.sender?.username}</strong>
                    <p>{msg.replyTo.text}</p>
                  </div>
                )}
                <div className="pd-msg-header">
                  <span className="pd-user">
                    {isOwn ? "You" : msg.sender?.username}
                  </span>
                  <span className="pd-time">{formatTime(msg.createdAt)}</span>
                </div>
                <div className="pd-text">{msg.text}</div>
                <button
                  className="pd-reply-btn"
                  onClick={() => setReplyMessage(msg)}
                >
                  Reply
                </button>
              </div>
            );
          })}
        </div>

        {replyMessage && (
          <div className="pd-replying">
            <div className="pd-reply-left">
              <span className="pd-reply-label">Replying to</span>
              <span className="pd-reply-user">
                {replyMessage.sender?.username}
              </span>
              <span className="pd-reply-text">{replyMessage.text}</span>
            </div>
            <button
              className="pd-reply-close"
              onClick={() => setReplyMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

        <div className="pd-input">
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

export default ProjectDetails;
