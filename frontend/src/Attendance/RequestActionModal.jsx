import React from "react";
import { formatTime, formatDateTimeDMY } from "../utils/Date";
import "./RequestActionModal.css";

export default function RequestActionModal({
  onClose,
  onConfirm,
  action,
  selectedRequest,
}) {
  const actionText = action === "approve" ? "Approve" : "Reject";
  const req = selectedRequest;
  if (!req) return null;

  const getCheckLabel = (c) => (c.isNew ? "New" : c.edited ? "Edited" : "");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{actionText} Attendance Request</h2>

        <div className="modal-section">
          <div><strong>User:</strong> {req.userId?.username || "-"}</div>
          <div><strong>Role:</strong> {req.userId?.role || "-"}</div>
        </div>

        <div className="modal-section">
          <strong>Status:</strong>
          <span className={`status-badge ${req.status.toLowerCase()}`}>
            {req.status}
          </span>
        </div>

        <div className="modal-section">
          <strong>Reason:</strong>
          <p className="reason-text">{req.reason || "-"}</p>
        </div>

        <div className="modal-section">
          <strong>Checks:</strong>
          <div className="checks-list">
            {req.checks?.map((c, idx) => (
              <div key={idx} className="check-item">
                <span className="check-type">{c.type}</span>
                <span className="check-time">{formatTime(c.time)}</span>
                {getCheckLabel(c) && (
                  <span className="check-label">{getCheckLabel(c)}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-section meta">
          <div><strong>Created:</strong> {formatDateTimeDMY(req.createdAt)}</div>
          <div><strong>Updated:</strong> {formatDateTimeDMY(req.updatedAt)}</div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onConfirm}>
            {actionText}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
