import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAttendance } from "../store/attendanceSlice";
import AttendanceApproveModal from "./AttendanceApprove";
import AttendanceRejectModal from "./AttendanceReject";
import Pagination from "../layout/Pagination";

import "./Attendance.css";
import { formatHoursMinutes } from "../utils/formatHoursMinutes";
import { formatTime } from "../utils/Date";
import { formatDateDMY } from "../utils/Date";

const AdminAttendanceList = () => {
  const dispatch = useDispatch();
  const { list: attendances = [], loading } = useSelector(
    (state) => state.attendance,
  );

  const [approveAttendance, setApproveAttendance] = useState(null);
  const [rejectAttendance, setRejectAttendance] = useState(null);

  // Filters
  const [searchUser, setSearchUser] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    dispatch(fetchAllAttendance());
  }, [dispatch]);

  const hasCheckOut = (checks = []) =>
    checks.some((c) => c.type === "Out");

 

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
          (current.type === "Out" && next.type === "In") ||
          (current.type === "In" && next.type === "Out")
        ) {
          rows.push({ type: "Break", out: current, in: next });
          i++;
          continue;
        }
      }
      rows.push({ type: current.type, time: current.time });
    }
    return rows;
  };

  // Apply search and filters
  const filteredAttendances = attendances.filter((day) => {
    const username = day.userId?.username?.toLowerCase() || "";
    const role = day.userId?.role || "";
    const status = day.requestStatus || "";

    const matchesUser = username.includes(searchUser.toLowerCase());
    const matchesRole = filterRole === "all" || role === filterRole;
    const matchesStatus = filterStatus === "all" || status === filterStatus;

    return matchesUser && matchesRole && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAttendances.length / itemsPerPage);
  const paginatedAttendances = filteredAttendances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="attendance-container">
      <div className="header-row">
        {/* Left Title */}
        <h1 className="attendance-title">Attendance List</h1>

        {/* Right Filters */}
        <div className="filters-row">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchUser}
            onChange={(e) => {
              setSearchUser(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Roles</option>
            <option value="employee">Employee</option>
            <option value="projectmanager">Project Manager</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>No</th>
                <th>User</th>
                <th>Date</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Total Hours</th>
                <th colSpan="2">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAttendances.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-attendance">
                    No attendance found
                  </td>
                </tr>
              ) : (
                paginatedAttendances.map((day, idx) => {
                  const checkoutDone = hasCheckOut(day.checks);
                  const isPending = day.requestStatus === "Pending";
                  const sessionRows = generateSessionRows(day.checks);

                  return sessionRows.map((row, ridx) => (
                    <tr key={`${day._id}-${ridx}`}>
                      {ridx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                      )}

                      {ridx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          <b>{day.userId?.username || "Unknown"}</b>
                          <div className="role-btn-wrapper">
                            {day.userId?.role === "employee" && (
                              <button className="btn role-btn employee-btn">
                                Employee
                              </button>
                            )}
                            {day.userId?.role === "projectmanager" && (
                              <button className="btn role-btn manager-btn">
                                Project Manager
                              </button>
                            )}
                          </div>
                        </td>
                      )}

                      {ridx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          {formatDateDMY(day.date)}
                        </td>
                      )}

                      <td>
                        {row.type === "Break" ? (
                          <>
                            <span className="session-badge badge-in">
                              In: {formatTime(row.out.time)}
                            </span>
                            <span className="session-badge badge-out">
                              Out: {formatTime(row.in.time)}
                            </span>
                          </>
                        ) : row.type === "In" || row.type === "In" ? (
                          <span className="session-badge badge-in">
                            {row.type}: {formatTime(row.time)}
                          </span>
                        ) : row.type === "Out" || row.type === "Out" ? (
                          <span className="session-badge badge-out">
                            {row.type}: {formatTime(row.time)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      {ridx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          <span
                            className={`status ${day.requestStatus?.toLowerCase()}`}
                          >
                            {day.requestStatus}
                          </span>
                        </td>
                      )}

                      {ridx === 0 && (
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

                      {ridx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          <button
                            className={`btn btn-success btn-sm ${
                              !isPending || !checkoutDone ? "disabled" : ""
                            }`}
                            disabled={!isPending || !checkoutDone}
                            onClick={() => setApproveAttendance(day)}
                          >
                            ✔
                          </button>
                        </td>
                      )}

                      {ridx === 0 && (
                        <td rowSpan={sessionRows.length}>
                          <button
                            className={`btn btn-danger btn-sm ${
                              !isPending || !checkoutDone ? "disabled" : ""
                            }`}
                            disabled={!isPending || !checkoutDone}
                            onClick={() => setRejectAttendance(day)}
                          >
                            ✗
                          </button>
                        </td>
                      )}
                    </tr>
                  ));
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {approveAttendance && (
        <AttendanceApproveModal
          attendance={approveAttendance}
          onClose={() => {
            setApproveAttendance(null);
            dispatch(fetchAllAttendance());
          }}
        />
      )}

      {rejectAttendance && (
        <AttendanceRejectModal
          attendance={rejectAttendance}
          onClose={() => {
            setRejectAttendance(null);
            dispatch(fetchAllAttendance());
          }}
        />
      )}
    </div>
  );
};

export default AdminAttendanceList;
