import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../store/devicesSlice";
import { fetchUsers } from "../store/userSlice";
import { assignAssetToUser, fetchAssignedAssets } from "../store/assignSlice";
import { toast } from "react-toastify";
import "./AssignList.css";

export default function AssignModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { devices = [] } = useSelector((state) => state.devices);
  const { users = [] } = useSelector((state) => state.user);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [deviceSearch, setDeviceSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [modalError, setModalError] = useState("");


  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDevices());
      dispatch(fetchUsers());
      setSelectedDevice(null);
      setSelectedUser(null);
      setDeviceSearch("");
      setUserSearch("");
      setModalError("");
    }
  }, [dispatch, isOpen]);

  const handleAssign = async () => {
    setModalError("");

    if (!selectedDevice || !selectedUser) {
      setModalError("Please select both device and user");
      return;
    }

    try {
      await dispatch(
        assignAssetToUser({
          assetId: selectedDevice._id,
          userId: selectedUser._id,
          assignedQty: 1,
        })
      ).unwrap();

      toast.success("Asset assigned successfully");
      dispatch(fetchAssignedAssets());
      onClose();
    } catch (err) {
      setModalError(err?.message || "Failed to assign asset");
    }
  };

  if (!isOpen) return null;

  // Filter devices by search input and only active ones
  const filteredDevices = devices.filter(
    (d) =>
      d.status === "Active" &&
      d.name.toLowerCase().includes(deviceSearch.toLowerCase())
  );

  // Filter users by search input
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="am-modal">
      <div className="am-modal-content">
        <h2>Assign Asset</h2>

        {/* DEVICE SEARCH */}
        <label>Search Device</label>
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
        {/* Show list only if no device selected */}
        {!selectedDevice && (
          <div className="am-list-scroll">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((d) => (
                <div
                  key={d._id}
                  className={`am-list-item ${
                    selectedDevice?._id === d._id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDevice(d)}
                >
                  {d.name} 
                </div>
              ))
            ) : (
              <div className="am-list-item">No devices found</div>
            )}
          </div>
        )}

        {/* USER SEARCH */}
        <label>Search User</label>
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
        {/* Show list only if no user selected */}
        {!selectedUser && (
          <div className="am-list-scroll">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className={`am-list-item ${
                    selectedUser?._id === u._id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedUser(u)}
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
          <button className="am-btn-submit" onClick={handleAssign}>
            Assign
          </button>
          <button className="am-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
