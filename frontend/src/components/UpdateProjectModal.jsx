import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateProject, fetchUsers, fetchProjects } from "../store/projectSlice";
import { toast } from "react-toastify";

const UpdateProjectModal = ({ isOpen, onClose, project }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.project);
  const { userInfo } = useSelector((state) => state.user);
  const selectAllRef = useRef(null);

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    estimatedDays: "",
    assignedProjectManager: "",
    assignedEmployees: [],
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Load project data when modal opens
  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || "",
        projectDescription: project.projectDescription || "",
        estimatedDays: project.estimatedDays || "",
        assignedProjectManager: project.assignedProjectManager?._id || "",
        assignedEmployees: project.assignedEmployees?.map((e) => e._id) || [],
      });
    }
  }, [project]);

  // Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle employee checkbox toggle
  const handleEmployeeCheckbox = (empId) => {
    setFormData((prev) => {
      const exists = prev.assignedEmployees.includes(empId);
      return {
        ...prev,
        assignedEmployees: exists
          ? prev.assignedEmployees.filter((id) => id !== empId)
          : [...prev.assignedEmployees, empId],
      };
    });
  };

  // Remove employee from assigned
  const handleRemoveSelected = (id) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.filter((empId) => empId !== id),
    }));
  };

  // Select all / unselect all filtered employees
  const handleSelectAll = () => {
    const filteredEmployees = employees.filter((emp) =>
      emp.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  // Clear all assigned employees
  const handleClearAll = () => {
    setFormData((prev) => ({ ...prev, assignedEmployees: [] }));
  };

  // Employees filtered by search
  const employees = users.filter((u) => u.role === "employee");
  const filteredEmployees = employees.filter((emp) =>
    emp.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Indeterminate logic for select all
  useEffect(() => {
    if (!selectAllRef.current) return;
    const selectedCount = filteredEmployees.filter((emp) =>
      formData.assignedEmployees.includes(emp._id)
    ).length;

    selectAllRef.current.indeterminate =
      selectedCount > 0 && selectedCount < filteredEmployees.length;
  }, [filteredEmployees, formData.assignedEmployees]);

  // Submit updated project
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectName.trim()) return toast.error("Project name is required");

    try {
      await dispatch(updateProject({ id: project._id, data: formData })).unwrap();
      toast.success("Project updated successfully!");
      onClose();
      dispatch(fetchProjects());
    } catch {
      toast.error("Failed to update project!");
    }
  };

  if (!project) return null;

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Project</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* Project Name */}
          <div className="cp-field mb-2">
            <label>Project Name</label>
            <input
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Description */}
          <div className="cp-field mb-2">
            <label>Description</label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Estimated Days */}
          <div className="cp-field mb-2">
            <label>Estimated Days</label>
            <input
              name="estimatedDays"
              value={formData.estimatedDays}
              onChange={handleChange}
              type="number"
              className="form-control"
            />
          </div>

          {/* Project Manager */}
          {userInfo.role === "admin" && (
            <div className="cp-field mb-3">
              <label>Project Manager</label>
              <select
                name="assignedProjectManager"
                value={formData.assignedProjectManager}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select</option>
                {users
                  .filter((u) => u.role === "projectmanager")
                  .map((pm) => (
                    <option key={pm._id} value={pm._id}>
                      {pm.username}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Assigned Employees */}
          <label className="cp-subtitle">Assign Employees</label>

          {formData.assignedEmployees.length > 0 && (
            <div className="cp-selected-box mb-2">
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

          {/* Employee list with search, select all, clear */}
          <div className="cp-employee-box mb-3">
            <input
              className="cp-search mb-2"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="cp-select-row mb-2">
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
                <label key={emp._id} className="d-block mb-1">
                  <input
                    type="checkbox"
                    checked={formData.assignedEmployees.includes(emp._id)}
                    onChange={() => handleEmployeeCheckbox(emp._id)}
                    className="me-2"
                  />
                  {emp.username}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <Button type="submit" className="mt-2">
            Update Project
          </Button>
          <Button variant="secondary" className="mt-2 ms-2" onClick={onClose}>
            Cancel
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProjectModal;
