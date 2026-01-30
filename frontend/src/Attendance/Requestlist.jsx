import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyRequests } from "../store/attendanceRequestSlice";
import { formatDateTimeDMY,formatTime } from "../utils/Date";
import "./RequestList.css";

const generateSessions = (checks) => {
  if (!checks || !checks.length) return [];

  const sorted = [...checks].sort((a, b) => new Date(a.time) - new Date(b.time));
  const sessions = [];
  let lastIn = null;

  sorted.forEach((check) => {
    const t = new Date(check.time);

    if (check.type === "In") {
      lastIn = check;
    } else if (check.type === "Out" && lastIn) {
      sessions.push({ in: lastIn, out: check });
      lastIn = null;
    }
  });

  return sessions;
};

/* ===================== COMPONENT ===================== */
export default function MyRequestList() {
  const dispatch = useDispatch();
  const { list = [], loading, error } = useSelector((state) => state.attendanceRequest);

  useEffect(() => {
    dispatch(fetchMyRequests());
  }, [dispatch]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">My Attendance Request</h2>

      <div className="table-responsive">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Date</th>
              <th>Sessions</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-attendance">
                  No requests found
                </td>
              </tr>
            ) : (
              list.map((req, idx) => {
                const sessions = generateSessions(req.checks);
                return (
                  <tr key={req._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <b>{req.userId?.username || "-"}</b>
                    </td>

                    <td>{req.checks?.length ? formatDateTimeDMY(req.checks[0].time) : "-"}</td>

                    <td>
                      {sessions.map((session, i) => (
                        <div key={i} className="session-row">
                          <span className="session-badge badge-in">
                            In: {formatTime(session.in.time)}
                          </span>
                          <span className="session-badge badge-out">
                            Out: {formatTime(session.out.time)}
                          </span>
                        </div>
                      ))}
                      
                    </td>

                    <td>{req.reason || "-"}</td>

                    <td>
                      <span className={`status ${req.status?.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
