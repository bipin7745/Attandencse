import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteAssignedAsset, fetchaAssignedDefective } from "../store/assignSlice";
import { toast } from "react-toastify";
import "../Assign/AssignList.css"; 

export default function DeleteModal({ asset, onClose }) {
  const dispatch = useDispatch();
  const [modalError, setModalError] = useState("");

  const handleDelete = async () => {
    setModalError("");
    try {
      await dispatch(deleteAssignedAsset(asset._id)).unwrap();
      toast.success(" Deleted Defective successfully");
      dispatch(fetchaAssignedDefective());
      onClose();
    } catch (err) {
      setModalError(err.message || "Failed to delete assignment");
    }
  };

  if (!asset) return null;

  return (
    <div className="am-modal">
      <div className="modal-content1">
        <h2>Delete Defective Assignment</h2>
        <p>
          Are you sure you want to delete <b>{asset.asset?.name}</b> assigned to <b>{asset.assignedToUser?.username}</b>?
        </p>

        {modalError && <div className="modal-error1">{modalError}</div>}

        <div className="modal-buttons1">
          <button onClick={handleDelete} className="btn-submit1">Yes</button>
          <button onClick={onClose} className="btn-cancel1">No</button>
        </div>
      </div>
    </div>
  );
}
