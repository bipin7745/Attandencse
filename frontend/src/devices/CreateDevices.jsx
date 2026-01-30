import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDevice, fetchDevices } from "../store/devicesSlice";
import { toast } from "react-toastify";

export default function CreateDeviceModal({ close }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [quality, setQuality] = useState("");
  const [modalError, setModalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!name.trim() || !quality) {
      setModalError("Please fill all fields");
      return;
    }

    try {
      await dispatch(addDevice({ name, quality })).unwrap();
      toast.success("Device created successfully");
      dispatch(fetchDevices());
      close();
    } catch (err) {
      setModalError(err || "Failed to create device");
    }
  };

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>Create Device</h2>

        <input
          type="text"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
        />

        {modalError && <div className="modal-error">{modalError}</div>}

        <div className="modal-buttons">
          <button type="submit" className="btn-submit">Add</button>
          <button type="button" onClick={close} className="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
