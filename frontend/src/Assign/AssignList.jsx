import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentByAssetAndUser } from "../store/assignSlice";
import RequestModal from "./RequestModal";
import "bootstrap/dist/css/bootstrap.min.css";
import { formatDateTimeDMY } from "../utils/Date";
import "./AssignList1.css";
import Pagination from "../layout/Pagination"; 

export default function AssignList() {
  const dispatch = useDispatch();
  const { assignedAssets = [], loading } = useSelector(
    (state) => state.assign
  );

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const assetsPerPage = 6;

  useEffect(() => {
    dispatch(fetchAssignmentByAssetAndUser());
  }, [dispatch]);


  const totalPages = Math.ceil(assignedAssets.length / assetsPerPage);

  const indexOfLast = currentPage * assetsPerPage;
  const indexOfFirst = indexOfLast - assetsPerPage;
  const currentAssets = assignedAssets.slice(
    indexOfFirst,
    indexOfLast
  );


  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
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

  const handleRequestClick = (item) => {
    setSelectedAsset(item);
  };

  return (
    <div className="asset-request-container">
      <h1>Assigned Assets List</h1>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="request-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Asset</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Feedback</th>
                <th>Request Sent</th>
                <th>Request Approved</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentAssets.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    No assets assigned
                  </td>
                </tr>
              ) : (
                currentAssets.map((item, index) => {
                  const statusClass = getStatusColorClass(
                    item.request?.reqstatus
                  );

                  const hasRequest = Boolean(item.request);

                  const isActive =
                    item.status === "Active" ||
                    item.status === "Defective";

                  const requestStatus =
                    item.request?.reqstatus?.toLowerCase();

                  let requestDate = "-";
                  if (
                    hasRequest &&
                    (requestStatus === "approved" ||
                      requestStatus === "rejected")
                  ) {
                    requestDate = formatDateTimeDMY(
                      item.request?.updatedAt
                    );
                  }

                  return (
                    <tr key={item._id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{item.asset?.name || "—"}</td>
                      <td>{item.assignedQty || "—"}</td>
                      <td className={statusClass}>
                        {item.request?.reqstatus || "Active"}
                      </td>
                      <td>{item.request?.reason || "-"}</td>
                      <td>{item.request?.feedback || "-"}</td>
                      <td>
                        {item.request?.createdAt
                          ? formatDateTimeDMY(
                              item.request.createdAt
                            )
                          : "-"}
                      </td>
                      <td>{requestDate}</td>
                      <td>
                        {isActive ? (
                          hasRequest ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              disabled
                            >
                              Requested
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                handleRequestClick(item)
                              }
                            >
                              Request
                            </button>
                          )
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            disabled
                          >
                            Requested
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

  
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    

      {selectedAsset && (
        <RequestModal
          asset={selectedAsset}
          onClose={() => {
            setSelectedAsset(null);
            dispatch(fetchAssignmentByAssetAndUser());
          }}
        />
      )}
    </div>
  );
}
