import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance } from "../store/attendanceSlice";
import CheckInModal from "./CheckInModal";
import CheckOutModal from "./CheckOutModal";
import AttendanceRequestModal from "./AttendanceRequestModal";
import { formatHoursMinutes } from "../utils/formatHoursMinutes";
import {formatDateTimeDMY} from '../utils/Date';
import "./Attendance.css";

const UserAttendanceList = () => {
  const dispatch = useDispatch();
  const { list: attendances, loading } = useSelector(
    (state) => state.attendance,
  );

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [requestDate, setRequestDate] = useState(null);

  const generateSessionRows = (checks) => {
    const rows = [];
    for (let i = 0; i < checks.length; i++) {
      const current = checks[i];

      if (
        (current.type === "In" || current.type === "Out") &&
        i + 1 < checks.length
      ) {
        const next = checks[i + 1];
        if (
          (current.type === "In" && next.type === "Out") ||
          (current.type === "Out" && next.type === "In")
        ) {
          rows.push({
            sessions: [
              {
                type: current.type,
                time: new Date(current.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
              {
                type: next.type,
                time: new Date(next.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ],
          });
          i++;
          continue;
        }
      }

      rows.push({
        sessions: [
          {
            type: current.type,
            time: new Date(current.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      });
    }
    return rows;
  };
  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  return (
    <div className="attendance-container">
      <div className="action-buttons1">
        <h1 className="attendance-title">My Attendance</h1>

        <div className="action-btn-group">
          <button className="btn btn-in" onClick={() => setShowCheckIn(true)}>
            Check In
          </button>
          <button className="btn btn-out" onClick={() => setShowCheckOut(true)}>
            Check Out
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading attendance...</div>
      ) : (
        <div className="table-responsive">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>NO</th>
                <th>Date</th>
                <th>CheckList</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Attendance Edit Request</th>
              </tr>
            </thead>
            <tbody>
              {attendances.length ? (
                attendances.map((day, idx) => {
                  const sessionRows = generateSessionRows(day.checks);

                  return sessionRows.map((row, sidx) => (
                    <tr key={`${day._id}-${sidx}`}>
                      {sidx === 0 && (
                        <td rowSpan={sessionRows.length}>{idx + 1}</td>
                      )}
                      {sidx === 0 && (
                        <td rowSpan={sessionRows.length}>{formatDateTimeDMY(day.date)}</td>
                      )}

                      <td>
                        {row.sessions.map((s, i) => (
                          <span
                            key={i}
                            className={`session-badge ${s.type === "CheckIn" || s.type === "In" ? "badge-in" : "badge-out"}`}
                          >
                            {s.type}: {s.time}
                          </span>
                        ))}
                      </td>
                      {sidx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          <div className="hours-box">
                            <span className="hours">
                              Works: {formatHoursMinutes(day.totalHours)}
                            </span>
                            <span className="break">
                              Breaks: {formatHoursMinutes(day.Break)}
                            </span>
                          </div>
                        </td>
                      )}
                      {sidx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          <span
                            className={`status ${day.requestStatus?.toLowerCase()}`}
                          >
                            {day.requestStatus}
                          </span>
                        </td>
                      )}

                      {sidx === 0 && (
                        <td rowSpan={sessionRows.length}>{day.reason}</td>
                      )}
                      {sidx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          {
                            
                            <button
                              className="btn btn-request"
                              onClick={() => setRequestDate(day)}
                            >
                             Edit Request
                            </button>
                          }
                        </td>
                      )}
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan="4" className="no-attendance">
                    No attendance recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCheckIn && <CheckInModal onClose={() => setShowCheckIn(false)} />}
      {showCheckOut && <CheckOutModal onClose={() => setShowCheckOut(false)} />}
      {requestDate && (
        <AttendanceRequestModal
          date={requestDate.date}
          existingChecks={requestDate.checks}
          existingReason={requestDate.reason}
          onClose={() => setRequestDate(null)}
        />
      )}
    </div>
  );
};

export default UserAttendanceList;



