import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRequest, resetRequest } from "../store/requestSlice";
import "./RequestModal.css";
import { toast } from "react-toastify";

export default function RequestModal({ asset, onClose }) {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.request);

  const [reason, setReason] = useState("");

  useEffect(() => {
    if (success) {
      toast.success("Request submitted successfully");
      dispatch(resetRequest());
      onClose();
    }
  }, [success, dispatch, onClose]);

  const handleSubmit = () => {
    dispatch(
      createRequest({
        assignmentId: asset._id, 
        reason,
      })
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Request Asset</h3>

        <p>
          <b>Asset:</b> {asset.asset.name}
        </p>
        <p>
          <b>Quality:</b> {asset.assignedQty}
        </p>
        <p>
         <b>Reason:</b> </p>
        <textarea
          placeholder="Enter reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
         

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
