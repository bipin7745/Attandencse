import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteDevice, fetchDevices } from "../store/devicesSlice";
import { toast } from "react-toastify";
import "../../public/css/DevicesList.css";
export default function DeleteDeviceModal({ device, close }) {
  const dispatch = useDispatch();
  const [modalError, setModalError] = useState("");

  const handleDelete = async () => {
    setModalError("");
    try {
      await dispatch(deleteDevice(device._id)).unwrap();
      toast.success("Device deleted successfully");
      dispatch(fetchDevices());
      close();
    } catch {
      setModalError("Failed to delete device");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Delete Device</h2>
        <p>Are you sure you want to delete <b>{device.name}</b>?</p>

        {modalError && <div className="modal-error">{modalError}</div>}

        <div className="modal-buttons">
          <button onClick={handleDelete} className="btn-submit1">Yes</button>
          <button onClick={close} className="btn-cancel">No</button>
        </div>
      </div>
    </div>
  );
}
