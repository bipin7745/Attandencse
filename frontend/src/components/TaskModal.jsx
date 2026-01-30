import React, { useState, useEffect,useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../store/taskSlice";

export default function TaskModal({
  show,
  onClose,
  projectId,
  employees,
  projectStartDate,
  projectEstimatedDays,
  onTaskCreated,
}) {

  const dispatch = useDispatch();
  const creating = useSelector((state) => state.task.creating);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: [],
    startDate: "",
    endDate: "",
    estimatedDays: 0,
  });

const selectAllRef = useRef(null);
const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!show || !projectStartDate || !projectEstimatedDays) return;

    const today = new Date();
    const projectStart = new Date(projectStartDate);
    const projectEnd = new Date(projectStart);
    projectEnd.setDate(projectEnd.getDate() + Number(projectEstimatedDays) - 1);

    let start = today > projectEnd ? projectEnd : today;
    if (start < projectStart) start = projectStart;

    let end = new Date(start);
    end.setDate(start.getDate() + Number(projectEstimatedDays) - 1);
    if (end > projectEnd) end = projectEnd;

    setFormData({
      title: "",
      description: "",
      assignedTo: [],
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      estimatedDays: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
    });
  }, [show, projectStartDate, projectEstimatedDays]);

  useEffect(() => {
    if (!formData.startDate || !formData.endDate) return;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    let diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays < 0) diffDays = 0;

    setFormData((prev) => ({ ...prev, estimatedDays: diffDays }));
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeCheck = (id) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(id)
        ? prev.assignedTo.filter((empId) => empId !== id)
        : [...prev.assignedTo, id],
    }));
  };
const handleRemoveSelected = (id) => {
  setFormData((prev) => ({
    ...prev,
    assignedTo: prev.assignedTo.filter((empId) => empId !== id),
  }));
};

const filteredEmployees = employees.filter((emp) =>
  emp.username.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleSelectAll = () => {
  const ids = filteredEmployees.map((emp) => emp._id);
  const allSelected = ids.every((id) =>
    formData.assignedTo.includes(id)
  );

  setFormData((prev) => ({
    ...prev,
    assignedTo: allSelected
      ? prev.assignedTo.filter((id) => !ids.includes(id))
      : [...new Set([...prev.assignedTo, ...ids])],
  }));
};

const handleClearAll = () => {
  setFormData((prev) => ({ ...prev, assignedTo: [] }));
};
useEffect(() => {
  if (!selectAllRef.current) return;

  const selectedCount = filteredEmployees.filter((emp) =>
    formData.assignedTo.includes(emp._id)
  ).length;

  selectAllRef.current.indeterminate =
    selectedCount > 0 && selectedCount < filteredEmployees.length;
}, [filteredEmployees, formData.assignedTo]);

 
   const handleSubmit = async () => {
     const {
       title,
       description,
       assignedTo,
       startDate,
       endDate,
       estimatedDays,
     } = formData;
 
     try {
       await dispatch(
         createTask({
           projectId,
           title,
           description,
           assignedTo,
           startDate,
           endDate,
           estimatedDays,
         })
       ).unwrap();
 
       toast.success("Task Assigned Successfully ✅");
       onTaskCreated();
       onClose();
     } catch (err) {
       toast.error(err); 
     }
   };
   
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Assign Task</Modal.Title>
      </Modal.Header>

      <Modal.Body>
    
        <Form.Group className="mb-3">
          <Form.Label>Task Title</Form.Label>
          <Form.Control
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            min={new Date(projectStartDate).toISOString().split("T")[0]}
            max={new Date(new Date(projectStartDate).getTime() + (projectEstimatedDays - 1) * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
          
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            min={formData.startDate}
            max={new Date(new Date(projectStartDate).getTime() + (projectEstimatedDays - 1) * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
       
            onChange={handleChange}
          />
        </Form.Group>
  <Form.Group className="mb-3">
  <Form.Label>Assign Employees</Form.Label>

  {/* Selected chips */}
  {formData.assignedTo.length > 0 && (
    <div className="cp-selected-box">
      {employees
        .filter((emp) => formData.assignedTo.includes(emp._id))
        .map((emp) => (
          <span key={emp._id} className="cp-chip">
            {emp.username}
            <button type="button" onClick={() => handleRemoveSelected(emp._id)}>
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
              formData.assignedTo.includes(emp._id)
            )
          }
          onChange={handleSelectAll}
        />
        Select All
      </label>

      <button
        type="button"
        onClick={handleClearAll}
        disabled={!formData.assignedTo.length}
      >
        Clear
      </button>
    </div>

    <div className="cp-emp-list">
      {filteredEmployees.map((emp) => (
        <label key={emp._id}>
          <input
            type="checkbox"
            checked={formData.assignedTo.includes(emp._id)}
            onChange={() => handleEmployeeCheck(emp._id)}
          />
          {emp.username}
        </label>
      ))}
    </div>
  </div>
</Form.Group>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={creating}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="primary" >
          {creating ? "Assigning..." : "Assign Task"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
