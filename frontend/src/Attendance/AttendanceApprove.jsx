import React from "react";
import { useDispatch } from "react-redux";
import {fetchAllAttendance, updateAttendanceStatus } from "../store/attendanceSlice";
import "./Attendance.css";

const AttendanceApproveModal = ({ attendance, onClose }) => {
  const dispatch = useDispatch();

  const handleApprove = () => {
    dispatch(
      updateAttendanceStatus({
        id: attendance._id,
        status: "Approved",
      })
    );
    fetchAllAttendance();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Approve Attendance</h3>
        <p>
          Are you sure you want to approve attendance for{" "}
          <b>Username:-{attendance.userId?.username} Role:-{attendance.userId?.role}</b>
        </p>

        <div className="modal-actions">
          <button className="btn btn-success" onClick={handleApprove}>
            Yes, Approve
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceApproveModal;
