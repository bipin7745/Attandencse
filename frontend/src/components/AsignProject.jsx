import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/projectSlice";
import { formatDateDMY } from "../utils/Date";

import { useNavigate } from "react-router-dom";
import "../../public/css/AsignProject.css";

export default function AsignProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projects, loading, error } = useSelector((state) => state.project);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = useMemo(() => {
    if (!projects || !userInfo) return [];

    switch (userInfo.role) {
      case "admin":
        return projects;
      case "projectmanager":
        return projects.filter(
          (project) => project.assignedProjectManager?._id === userInfo.id
        );
      case "employee":
        return projects.filter((project) =>
          project.assignedEmployees?.some((emp) => emp._id === userInfo.id)
        );
      default:
        return [];
    }
  }, [projects, userInfo]);

  if (loading)
    return <p className="loading">Loading projects, please wait...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="project-list-page">
      
      <div className="project-header">
         <h2 >Assigned Projects</h2>
      

        {(userInfo.role === "admin" ||
          userInfo.role === "projectmanager") && (
          <button
            className="toggle-form-btn"
            onClick={() => navigate("/project-create")}
          >
            + Create Project
          </button>
        )}
      </div>
   

      {filteredProjects.length === 0 ? (
        <p className="empty">No projects assigned to you.</p>
      ) : (
        <div className="project-container">
          {filteredProjects.map((project) => (
            <div
              className="project-card"
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="card-header">
                <h3 className="project-name">{project.projectName}</h3>
              </div>
              <p className="project-desc">{project.projectDescription}</p>

              <div className="card-info">
                <p>
                  <strong>⏱ Estimated Days:</strong> {project.estimatedDays}
                </p>
                <p>
                  <strong>👨‍💼 Project Manager:</strong>{" "}
                  {project.assignedProjectManager?.username || "Not Assigned"}
                </p>
                <p>
                  <strong>👥 Employees:</strong>{" "}
                  {project.assignedEmployees
                    ?.map((emp) => emp.username)
                    .join(", ") || "None"}
                </p>
                <p>
                  <strong>📅 Created:</strong>{" "}
                   {formatDateDMY(project.createdAt)}
                </p>
              
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
