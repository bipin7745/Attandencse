import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {fetchAllAttendance, updateAttendanceStatus } from "../store/attendanceSlice";
import "./Attendance.css";

const AttendanceRejectModal = ({ attendance, onClose }) => {
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    dispatch(
      updateAttendanceStatus({
        id: attendance._id,
        status: "Rejected",
        reason,
      })
    );
    fetchAllAttendance();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Reject Attendance</h3>

        {/* ✅ User Info */}
        <div className="reject-user-info">
          <p>
            <strong>User:</strong>{" "}
            {attendance.userId?.username || "Unknown"}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {attendance.userId?.role || "-"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {attendance.date
              ? new Date(attendance.date).toLocaleDateString()
              : "-"}
          </p>
        </div>

        {/* ✅ Reason Field */}
        <label className="modal-label">Reason for Rejection</label>
        <textarea
          className="sm-input"
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />

        {/* ✅ Actions */}
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={handleReject}>
            Reject 
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRejectModal;
