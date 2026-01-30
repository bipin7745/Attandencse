import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateDevice, fetchDevices } from "../store/devicesSlice";
import { toast } from "react-toastify";

export default function UpdateDeviceModal({ device, close }) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [quality, setQuality] = useState(1);
  const [status, setStatus] = useState("Active");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (device) {
      setName(device.name);
      setQuality(device.quality);
      setStatus(device.status);
    }
  }, [device]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!name.trim()) {
      setModalError("Device name is required");
      return;
    }

    if (quality < 1) {
      setModalError("Quantity must be at least 1");
      return;
    }

    try {
      await dispatch(
        updateDevice({
          id: device._id,
          updatedDevice: { name, quality, status },
        })
      ).unwrap();

      toast.success("Device updated successfully");
      dispatch(fetchDevices());
      close();
    } catch {
      setModalError("Failed to update device");
    }
  };

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>Update Device</h2>

        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input
          type="number"
          min="1"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />

        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="Active"
              checked={status === "Active"}
              onChange={(e) => setStatus(e.target.value)}
            /> Active
          </label>
          <label>
            <input
              type="radio"
              value="Inactive"
              checked={status === "Inactive"}
              onChange={(e) => setStatus(e.target.value)}
            /> Inactive
          </label>
        </div>

        {modalError && <div className="modal-error">{modalError}</div>}

        <div className="modal-buttons">
          <button type="submit" className="btn-submit">Update</button>
          <button type="button" onClick={close} className="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
