import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../store/devicesSlice";
import { fetchUsers } from "../store/userSlice";
import { updateAssignedAsset } from "../store/assignSlice";
import { toast } from "react-toastify";
import "./AssignList.css";

export default function EditAssignModal({ asset, onClose, refreshList }) {
  const dispatch = useDispatch();
  const { devices = [] } = useSelector((state) => state.devices);
  const { users = [] } = useSelector((state) => state.user);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [deviceSearch, setDeviceSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (asset) {
      dispatch(fetchDevices());
      dispatch(fetchUsers());

      setSelectedDevice(asset.asset || null);
      setSelectedUser(asset.assignedToUser || null);

      setDeviceSearch("");
      setUserSearch("");
      setModalError("");
    }
  }, [dispatch, asset]);

  const handleUpdate = async () => {
    setModalError("");

    if (!selectedDevice || !selectedUser) {
      setModalError("Please select both device and user");
      return;
    }

    try {
      await dispatch(
        updateAssignedAsset({
          id: asset._id,
          assetId: selectedDevice._id,
          userId: selectedUser._id,
        })
      ).unwrap();

      toast.success("Assignment updated successfully");
      refreshList();
      onClose();
    } catch (err) {
      setModalError(err?.message || "Failed to update assignment");
    }
  };

  if (!asset) return null;

  // 🔥 REMOVE selected item from list
  const filteredDevices = devices.filter(
    (d) =>
      d.status === "Active" &&
      d._id !== selectedDevice?._id &&
      d.name.toLowerCase().includes(deviceSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u._id !== selectedUser?._id &&
      u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="am-modal">
      <div className="am-modal-content">
        <h2>Edit Assignment</h2>

        {/* DEVICE */}
        <label>Device</label>
        <input
          type="text"
          placeholder="Search device..."
          value={selectedDevice ? selectedDevice.name : deviceSearch}
          onChange={(e) => {
            setDeviceSearch(e.target.value);
            setSelectedDevice(null);
          }}
          className="am-search"
        />

        {!selectedDevice && (
          <div className="am-list-scroll">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((d) => (
                <div
                  key={d._id}
                  className="am-list-item"
                  onClick={() => {
                    setSelectedDevice(d);
                    setDeviceSearch("");
                  }}
                >
                  {d.name}
                </div>
              ))
            ) : (
              <div className="am-list-item">No devices found</div>
            )}
          </div>
        )}

        {/* USER */}
        <label>User</label>
        <input
          type="text"
          placeholder="Search user..."
          value={selectedUser ? selectedUser.username : userSearch}
          onChange={(e) => {
            setUserSearch(e.target.value);
            setSelectedUser(null);
          }}
          className="am-search"
        />

        {!selectedUser && (
          <div className="am-list-scroll">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="am-list-item"
                  onClick={() => {
                    setSelectedUser(u);
                    setUserSearch("");
                  }}
                >
                  {u.username} ({u.role})
                </div>
              ))
            ) : (
              <div className="am-list-item">No users found</div>
            )}
          </div>
        )}

        {modalError && <div className="am-modal-error">{modalError}</div>}

        <div className="am-modal-buttons">
          <button className="am-btn-submit" onClick={handleUpdate}>
            Update
          </button>
          <button className="am-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
