import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { approveDeviceRequest, fetchRequests } from "../store/requestSlice";
import "./StatusModal.css";

export default function ApproveDeviceModal({ request, onClose }) {
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState(request.feedback || "");
  const [statusType, setStatusType] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleApprove = async () => {
    setErrorMessage(""); 

    if (!feedback.trim()) {
      setErrorMessage("Please enter feedback before approving.");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(
        approveDeviceRequest({
          id: request._id,
          status: statusType,
          feedback: feedback.trim(),
        })
      );

      if (approveDeviceRequest.fulfilled.match(result)) {
        await dispatch(fetchRequests());
        onClose();
      } else {
      
        setErrorMessage(result.payload || "Failed to approve the request");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to approve the request");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Approve Assets Request</h2>

    

        <div className="modal-info">
          <p>
            <b>Asset:</b> {request.asset?.name || "—"}
          </p>
          <p>
            <b>Requested By:</b> {request.requestedBy?.username || "—"}
          </p>
          <p>
            <b>Reason:</b> {request.reason || "—"}
          </p>
        </div>

        <div className="modal-feedback">
          <label>
            <b>Feedback:</b>
          </label>
          <textarea
            className="modal-textarea"
            placeholder="Enter feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="modal-status">
          <label>
            <input
              type="radio"
              value="Active"
              checked={statusType === "Active"}
              onChange={(e) => setStatusType(e.target.value)}
            />
            Active
          </label>

          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              value="Defective"
              checked={statusType === "Defective"}
              onChange={(e) => setStatusType(e.target.value)}
            />
            Defective
          </label>
        </div>
        {errorMessage && <div className="modal-error">{errorMessage}</div>}
        <div className="modal-buttons">
          <button onClick={handleApprove} disabled={loading}>
            {loading ? "Approving..." : "Approve"}
          </button>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
