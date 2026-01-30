import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTasksByProject } from "../store/taskSlice";
import "../../public/css/TaskList.css";

export default function TaskList({ projectId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: tasks, loading } = useSelector((state) => state.task);

  useEffect(() => {
    if (projectId) dispatch(fetchTasksByProject(projectId));
  }, [projectId, dispatch]);

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("en-GB") : "-");

  if (loading) return <p>Loading tasks...</p>;
  if (!tasks.length) return <p>No tasks found for this project.</p>;

  return (
    <div className="task-wrapper">
  <h4>📋 All Tasks</h4>
  <div className="task-scroll">
    {tasks.map((task) => (
      <div key={task._id} className="task-card" onClick={() => navigate(`/task-details/${task._id}`)}>
        <div className="task-header">
          <h5>{task.title}</h5>
          <span>{task.estimatedDays} days</span>
        </div>
        <p>{task.description}</p>
        <p>
          👤 Assigned to: {task.assignedTo?.length ? task.assignedTo.map(u => u.username).join(", ") : "Not assigned"}
        </p>
        <p>📅 Start: {formatDate(task.startDate)}</p>
        <p>🏁 End: {formatDate(task.endDate)}</p>
      </div>
    ))}
  </div>
</div>

  );
}
