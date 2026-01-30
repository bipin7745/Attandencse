import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllRequests,
  approveRequest,
  rejectRequest,
} from "../store/attendanceRequestSlice";
import RequestActionModal from "./RequestActionModal";
import "./AttendanceRequestList.css";
import { formatTime, formatDateTimeDMY } from "../utils/Date";

const AttendanceRequestList = () => {
  const dispatch = useDispatch();
  const {
    list = [],
    loading,
    error,
  } = useSelector((state) => state.attendanceRequest);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);

  const openModal = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
    setActionType("");
  };

  const handleConfirm = async () => {
    if (!selectedRequest) return;

    try {
      if (actionType === "approve") {
        await dispatch(approveRequest(selectedRequest._id)).unwrap();
      } else {
        await dispatch(rejectRequest(selectedRequest._id)).unwrap();
      }
      closeModal();
      dispatch(fetchAllRequests());
    } catch (err) {
      alert(err.message || "Action failed");
    }
  };

  const generateSessionRows = (checks = []) => {
    const rows = [];
    for (let i = 0; i < checks.length; i++) {
      const current = checks[i];
      const next = checks[i + 1];
      if (
        next &&
        ((current.type === "Out" && next.type === "In") ||
          (current.type === "In" && next.type === "Out"))
      ) {
        rows.push({ type: "Break", out: current, in: next });
        i++;
      } else {
        rows.push({
          type: current.type,
          time: current.time,
          isNew: current.isNew,
          edited: current.edited,
        });
      }
    }
    return rows;
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance Request List</h1>

      <div className="table-responsive">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Date</th>
              <th>CheckList</th>
              <th>Reason</th>
              <th>Status</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-attendance">
                  No Requests Found
                </td>
              </tr>
            ) : (
              list.map((req, idx) => {
                const isPending = req.status === "Pending";
                const sessionRows = generateSessionRows(req.checks);

                return (
                  <tr key={req._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <b>{req.userId?.username || "Unknown"}</b>
                      <div className="role-btn-wrapper">
                        <button
                          className={`role-btn ${req.userId?.role === "employee" ? "employee-btn" : "manager-btn"}`}
                        >
                          {req.userId?.role || "-"}
                        </button>
                      </div>
                    </td>
                    <td>
                      {req.checks?.length
                        ? formatDateTimeDMY(req.checks[0].time)
                        : "-"}
                    </td>
                    <td>
                      {sessionRows.map((row, i) => (
                        <div key={i} style={{ marginBottom: "6px" }}>
                          {row.type === "Break" ? (
                            <>
                              <span className="session-badge badge-out">
                                Out: {formatTime(row.out.time)}{" "}
                                {row.out.isNew
                                  ? "(New)"
                                  : row.out.edited
                                    ? "(Edited)"
                                    : ""}
                              </span>
                              <span className="session-badge badge-in">
                                In: {formatTime(row.in.time)}{" "}
                                {row.in.isNew
                                  ? "(New)"
                                  : row.in.edited
                                    ? "(Edited)"
                                    : ""}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="check-date">
                                {formatDateTimeDMY(row.time)}
                              </div>
                              <span
                                className={`session-badge ${row.type === "In" ? "badge-in" : "badge-out"}`}
                              >
                                {row.type}: {formatTime(row.time)}{" "}
                                {row.isNew
                                  ? "(New)"
                                  : row.edited
                                    ? "(Edited)"
                                    : "(Old)"}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </td>
                    <td>{req.reason || "-"}</td>
                    <td>
                      <span className={`status ${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={!isPending}
                        onClick={() => openModal(req, "approve")}
                      >
                        ✔
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={!isPending}
                        onClick={() => openModal(req, "reject")}
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedRequest && (
        <RequestActionModal
          onClose={closeModal}
          onConfirm={handleConfirm}
          action={actionType}
          selectedRequest={selectedRequest}
        />
      )}
    </div>
  );
};

export default AttendanceRequestList;
