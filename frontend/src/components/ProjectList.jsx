import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaEdit, FaCalendarAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { fetchProjects, deleteProject } from "../store/projectSlice";
import DeleteModal from "./DeleteModal";
import UpdateProjectModal from "./UpdateProjectModal";
import Pagination from "../layout/Pagination"; // Import pagination component
import { toast } from "react-toastify";
import "../../public/css/ProjectList.css";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.project);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    dispatch(fetchProjects())
      .unwrap()
      .catch(() => toast.error("Failed to fetch projects"));
  }, [dispatch]);

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setDeleteModalOpen(true);
  };

  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setUpdateModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(selectedProject._id)).unwrap();
      toast.success("Project deleted successfully!");
      setDeleteModalOpen(false);
    } catch {
      toast.error("Failed to delete project!");
    }
  };

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <div className="project-list-page">
      <div className="project-header">
        <h2>All Projects</h2>
        <button
          className="toggle-form-btn"
          onClick={() => navigate("/project-create")}
        >
          + Create New Project
        </button>
      </div>

      <div className="projects-grid">
        {currentProjects.map((project) => (
          <div
            key={project._id}
            className="project-card"
            onClick={() => navigate(`/project/${project._id}`)}
          >
            <h3>{project.projectName}</h3>
            <p>{project.projectDescription}</p>
            <p>
              <strong>EstimatedDays:</strong> {project.estimatedDays}
            </p>

            <p>
              <GrUserManager className="icon" />
              {project.assignedProjectManager?.username || "Unassigned"}
            </p>

            <p>
              <FaUser className="icon" />
              {project.assignedEmployees?.map((e) => e.username).join(", ") ||
                "No Employees"}
            </p>

            <p>
              <FaCalendarAlt className="icon" />
              {new Date(project.createdAt).toLocaleDateString()}
            </p>

            <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
              <button
                className="icon-btn btn-warning"
                onClick={() => openUpdateModal(project)}
              >
                <FaEdit />
              </button>

              {loggedInUser.role === "admin" && (
                <button
                  className="icon-btn btn-danger"
                  onClick={() => openDeleteModal(project)}
                >
                  <MdDelete />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Use pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        projectName={selectedProject?.projectName}
      />

      <UpdateProjectModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectList;
