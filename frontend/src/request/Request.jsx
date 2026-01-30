import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests } from "../store/requestSlice";
import { FaSearch } from "react-icons/fa";
import ApproveDeviceModal from "./ApproveModal";
import RejectDeviceModal from "./RejectModal";
import Pagination from "../layout/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { formatDateTimeDMY } from "../utils/Date";
import "./Request.css";

export default function AssetRequestList() {
  const dispatch = useDispatch();
  const {
    requests = [],
    loading,
    error,
  } = useSelector((state) => state.request);

  const [currentPage, setCurrentPage] = useState(1);
  const [approveRequest, setApproveRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState("All");
  const requestsPerPage = 5;

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredRequests = requests.filter((req) => {
    const assetName = req.asset?.name?.toLowerCase() || "";
    const username = req.requestedBy?.username.toLowerCase() || "";
    const role = req.requestedBy?.role.toLowerCase() || "";
    const searchText = searchTerm.trim().toLowerCase();
    const statusFilter = req.reqstatus.toLowerCase();

    const matchesSearch =
      searchText === "" ||
      assetName.includes(searchText) ||
      username.includes(searchText) ||
      role.includes(searchText);

    const matchesStatus =
      statusFilters === "All" || statusFilter === statusFilters.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const getStatusColorClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  return (
    <div className="asset-request-container">
      <div className="asset-header">
        <h1>Asset Requests List</h1>

        <div className="asset-controls">
          <div className="search-box1">
            <FaSearch className="search-icon1" />
            <input
              type="text"
              placeholder="Search by asset, user or role..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <select
            className="form-select status-filter"
            value={statusFilters}
            onChange={(e) => setStatusFilters(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="table-responsive">
        <table className="request-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Asset Name</th>
              <th>Requested By</th>
              <th>Role</th>
              <th>Reason</th>
              <th>Feedback</th>
              <th>Status</th>
              <th>Request Sent</th>
              <th>Request Approved</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length === 0 ? (
              <tr>
                <td colSpan="11">No requests found</td>
              </tr>
            ) : (
              currentRequests.map((req, index) => {
                const isPending = req.reqstatus.toLowerCase() === "pending";
                return (
                  <tr key={req._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{req.asset?.name || "—"}</td>
                    <td>{req.requestedBy?.username || "—"}</td>
                    <td>{req.requestedBy?.role || "—"}</td>
                    <td>{req.reason || "—"}</td>
                    <td>{req.feedback || "—"}</td>
                    <td className={getStatusColorClass(req.reqstatus)}>
                      {req.reqstatus || "—"}
                    </td>
                    <td>{formatDateTimeDMY(req.createdAt || "_")}</td>
                    <td>
                      {req.reqstatus.toLowerCase() !== "pending"
                        ? formatDateTimeDMY(req.updatedAt || "_")
                        : "_"}
                    </td>
                    <td>
                      <button
                        disabled={!isPending}
                        className={`btn btn-success btn-sm ${
                          !isPending ? "disabled" : ""
                        }`}
                        onClick={() => setApproveRequest(req)}
                      >
                        ✔
                      </button>
                    </td>
                    <td>
                      <button
                        disabled={!isPending}
                        className={`btn btn-danger btn-sm ${
                          !isPending ? "disabled" : ""
                        }`}
                        onClick={() => setRejectRequest(req)}
                      >
                        ✗
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-wrapper">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {approveRequest && (
        <ApproveDeviceModal
          request={approveRequest}
          onClose={() => {
            setApproveRequest(null);
            dispatch(fetchRequests());
          }}
        />
      )}

      {rejectRequest && (
        <RejectDeviceModal
          request={rejectRequest}
          onClose={() => {
            setRejectRequest(null);
            dispatch(fetchRequests());
          }}
        />
      )}
    </div>
  );
}
