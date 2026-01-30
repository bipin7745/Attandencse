import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { rejectDeviceRequest, fetchRequests } from "../store/requestSlice";
import "./StatusModal.css";

export default function RejectDeviceModal({ request, onClose }) {
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState(request.feedback || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReject = async () => {
  
    if (!feedback.trim()) {
      setError("Feedback is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await dispatch(
        rejectDeviceRequest({
          id: request._id,
          feedback: feedback.trim(),
        })
      );

      if (rejectDeviceRequest.fulfilled.match(result)) {
        await dispatch(fetchRequests());
        onClose();
      } else {
        setError(result.payload || "Failed to reject request");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reject Device Request</h2>

        <p><b>Device:</b> {request.asset?.name}</p>
        <p><b>Requested By:</b> {request.requestedBy?.username}</p>
        <p><b>Reason:</b> {request.reason}</p>

        <textarea
          placeholder="Enter rejection feedback (required)"
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            if (error) setError(""); 
          }}
        />

  
        {error && <p className="modal-error">{error}</p>}

        <div className="modal-buttons">
          <button
            onClick={handleReject}
            disabled={loading}
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
