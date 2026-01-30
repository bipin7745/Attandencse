import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { checkOutAttendance } from "../store/attendanceSlice";
import "./Modal.css";

const CheckOutModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [ampm, setAmPm] = useState("AM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!date || !time) {
      setError("Please select both date and time.");
      return;
    }

    setLoading(true);
    setError("");

    let [hours, minutes] = time.split(":").map(Number);
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;

    try {
      await dispatch(checkOutAttendance({ date, time: formattedTime })).unwrap();
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to check out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Check Out</h2>

        <div className="form-row">
          <label htmlFor="date-input" className="modal-label">
            Date
          </label>
          <input
            id="date-input"
            type="date"
            className="input"
            value={date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-row time-row">
          <div>
            <label htmlFor="time-input" className="modal-label">
              Time
            </label>
            <input
              id="time-input"
              type="time"
              className="input time-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              step="60"
            />
          </div>
          <div>
            <label htmlFor="ampm-select" className="modal-label">
              AM/PM
            </label>
            <select
              id="ampm-select"
              className="input ampm-select"
              value={ampm}
              onChange={(e) => setAmPm(e.target.value)}
              aria-label="Select AM or PM"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="modal-actions">
         
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
           <button onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutModal;
