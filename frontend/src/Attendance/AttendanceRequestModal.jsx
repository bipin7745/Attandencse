import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendAttendanceRequest,
  fetchAllRequests,
} from "../store/attendanceRequestSlice";
import { useNavigate } from "react-router-dom";
import "./Request.css";

const AttendanceRequestModal = ({
  date,
  onClose,
  existingChecks = [],
  existingReason = "",
  requestId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, requestSuccess, error } = useSelector(
    (state) => state.attendanceRequest,
  );

  const [checks, setChecks] = useState([
    { type: "In", time: "", ampm: "AM", isNew: true },
  ]);
  const [reason, setReason] = useState("");

  // Convert ISO date to 12-hour format
  const convert24To12 = (timeStr) => {
    if (!timeStr) return { time: "", ampm: "AM" };
    const dateObj = new Date(timeStr);
    if (isNaN(dateObj.getTime())) return { time: "", ampm: "AM" };
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return { time: `${hours.toString().padStart(2, "0")}:${minutes}`, ampm };
  };

  const convertToFullDateTime = (time, ampm) => {
    if (!time) return null;
    let [hours, minutes] = time.split(":").map(Number);
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    const [year, month, day] = date.split("-");
    return new Date(year, month - 1, day, hours, minutes).toISOString();
  };

  useEffect(() => {
    if (existingChecks.length > 0) {
      setChecks(
        existingChecks.map((c) => ({
          ...c,
          ...convert24To12(c.time),
          isNew: false,
        })),
      );
    }
    setReason(existingReason);
  }, [existingChecks, existingReason]);

  useEffect(() => {
    if (requestSuccess) {
      onClose();
      dispatch(fetchAllRequests());
      navigate("/requestlist");
    }
  }, [requestSuccess]);

  const addCheck = () =>
    setChecks((prev) => [
      ...prev,
      { type: "In", time: "", ampm: "AM", isNew: true },
    ]);
  const updateCheck = (index, field, value) =>
    setChecks((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, [field]: value, edited: !c.isNew } : c,
      ),
    );

  const submitHandler = () => {
    const filteredChecks = checks.filter((c) => c.time.trim() !== "");
    if (!filteredChecks.length) return alert("Add at least one check.");
    const formattedChecks = filteredChecks.map((c) => ({
      type: c.type,
      time: convertToFullDateTime(c.time, c.ampm),
      isNew: c.isNew,
      edited: c.edited,
    }));
    dispatch(
      sendAttendanceRequest({
        date,
        reason,
        checks: formattedChecks,
        requestId,
      }),
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 450 }}>
        <h3>Attendance Request</h3>
        {checks.map((check, index) => (
          <div key={index} className="check-entry">
            <select
              value={check.type}
              onChange={(e) => updateCheck(index, "type", e.target.value)}
            >
              <option value="In">In</option>
              <option value="Out">Out</option>
            </select>
            <input
              type="time"
              value={check.time}
              onChange={(e) => updateCheck(index, "time", e.target.value)}
            />
            <select
              value={check.ampm}
              onChange={(e) => updateCheck(index, "ampm", e.target.value)}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            {/* {!check.isNew && (
              <span style={{ marginLeft: 8, color: "blue" }}>Old</span>
            )} */}
            {check.isNew && (
              <span style={{ marginLeft: 8, color: "green" }}>New</span>
            )}
            {/* {check.edited && (
              <span style={{ marginLeft: 8, color: "orange" }}>Edited</span>
            )} */}
          </div>
        ))}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
          rows={4}
        />
        <button onClick={addCheck}>+ Add More</button>
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submitHandler} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRequestModal;
