import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, fetchUsers, clearMessage } from "../store/projectSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../public/css/CreateProject.css";

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectAllRef = useRef(null);

  const { users, loading, successMessage, error } = useSelector(
    (state) => state.project
  );
  const { userInfo } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    estimatedDays: "",
    assignedProjectManager: "",
    assignedEmployees: [],
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo.role === "projectmanager") {
      setFormData((prev) => ({
        ...prev,
        assignedProjectManager: userInfo.id,
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessage());
      navigate("/project-list");
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [successMessage, error, dispatch, navigate, userInfo.role]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEmployeeCheck = (id) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.includes(id)
        ? prev.assignedEmployees.filter((empId) => empId !== id)
        : [...prev.assignedEmployees, id],
    }));
  };

  const handleRemoveSelected = (id) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.filter((empId) => empId !== id),
    }));
  };

  const handleSelectAll = () => {
    const ids = filteredEmployees.map((emp) => emp._id);
    const allSelected = ids.every((id) =>
      formData.assignedEmployees.includes(id)
    );

    setFormData((prev) => ({
      ...prev,
      assignedEmployees: allSelected
        ? prev.assignedEmployees.filter((id) => !ids.includes(id))
        : [...new Set([...prev.assignedEmployees, ...ids])],
    }));
  };

  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.projectName.trim())
      return toast.error("Project name is required");
    if (!formData.projectDescription.trim())
      return toast.error("Project description is required");
    if (!formData.estimatedDays || formData.estimatedDays <= 0)
      return toast.error("Estimated days must be greater than 0");
    if (!formData.assignedProjectManager)
      return toast.error("Please assign project manager");

    dispatch(createProject(formData));
  };

  const projectManagers = users.filter((u) => u.role === "projectmanager");
  const employees = users.filter((u) => u.role === "employee");
  const filteredEmployees = employees.filter((emp) =>
    emp.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Indeterminate checkbox logic for Select All
  useEffect(() => {
    if (!selectAllRef.current) return;
    const selectedCount = filteredEmployees.filter((emp) =>
      formData.assignedEmployees.includes(emp._id)
    ).length;

    selectAllRef.current.indeterminate =
      selectedCount > 0 && selectedCount < filteredEmployees.length;
  }, [filteredEmployees, formData.assignedEmployees]);

  return (
    <div className="create-project-container">
      <h2>Create New Project</h2>

      <form className="cp-form" onSubmit={handleSubmit}>
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate("/project-list")}
        >
          ← Back
        </button>

        {/* Project Details */}
        <div>
          <div className="cp-field">
            <label>Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
            />
          </div>

          <div className="cp-field">
            <label>Description</label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              placeholder="Enter project description"
            />
          </div>

          <div className="cp-field">
            <label>Estimated Days</label>
            <input
              type="number"
              name="estimatedDays"
              value={formData.estimatedDays}
              onChange={handleChange}
              placeholder="e.g. 30"
            />
          </div>
        </div>

        {/* Assignment */}
        <div>
          {userInfo.role === "admin" && (
            <div className="cp-field">
              <label>Project Manager</label>
              <select
                name="assignedProjectManager"
                value={formData.assignedProjectManager}
                onChange={handleChange}
              >
                <option value="">Select Project Manager</option>
                {projectManagers.map((pm) => (
                  <option key={pm._id} value={pm._id}>
                    {pm.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="cp-subtitle">Assign Employees</label>

          {formData.assignedEmployees.length > 0 && (
            <div className="cp-selected-box">
              {employees
                .filter((emp) => formData.assignedEmployees.includes(emp._id))
                .map((emp) => (
                  <span key={emp._id} className="cp-chip">
                    {emp.username}
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(emp._id)}
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}

          <div className="cp-employee-box">
            <input
              className="cp-search"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="cp-select-row">
              <label>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={
                    filteredEmployees.length > 0 &&
                    filteredEmployees.every((emp) =>
                      formData.assignedEmployees.includes(emp._id)
                    )
                  }
                  onChange={handleSelectAll}
                />
                Select All
              </label>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={!formData.assignedEmployees.length}
              >
                Clear
              </button>
            </div>

            <div className="cp-emp-list">
              {filteredEmployees.map((emp) => (
                <label key={emp._id}>
                  <input
                    type="checkbox"
                    checked={formData.assignedEmployees.includes(emp._id)}
                    onChange={() => handleEmployeeCheck(emp._id)}
                  />
                  {emp.username}
                </label>
              ))}
            </div>
          </div>

          <button className="cp-submit" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
