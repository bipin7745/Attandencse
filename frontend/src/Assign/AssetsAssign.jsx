import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../store/devicesSlice";
import { fetchUsers } from "../store/userSlice";
import { fetchAssignedAssets } from "../store/assignSlice";
import AssignModal from "./CreateAssign";
import EditAssignModal from "./EditAssign";
import DeleteAssignModal from "./DeleteAssign";
import Pagination from "../layout/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AssignList.css";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AssetsAssign() {
  const dispatch = useDispatch();
  const { assignedAssets = [], loading, error } = useSelector(
    (state) => state.assign
  );

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [deleteAsset, setDeleteAsset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const assetsPerPage = 6;


  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchDevices());
    dispatch(fetchUsers());
    dispatch(fetchAssignedAssets());
  }, [dispatch]);


  const filteredAssets = assignedAssets.filter((item) => {
  const assetName = item.asset?.name?.toLowerCase() || "";
  const username = item.assignedToUser?.username?.toLowerCase() || "";
  const role = item.assignedToUser?.role?.toLowerCase() || "";
  const status = item.status?.toLowerCase() || "";

  const searchText = search.trim().toLowerCase();

  const matchesSearch =
    searchText === "" ||
    assetName.includes(searchText) ||
    username.includes(searchText) ||
    role.includes(searchText);

 
  const matchesStatus =
    statusFilter === "All" ||
    status === statusFilter.toLowerCase();

  return matchesSearch && matchesStatus;
});


const indexOfLast = currentPage * assetsPerPage;
const indexOfFirst = indexOfLast - assetsPerPage;
const currentAssets = filteredAssets.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredAssets.length / assetsPerPage);

useEffect(() => {
  setCurrentPage(1);
}, [search, statusFilter]);


  return (
    <div className="container py-4">
     
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Assigned Assets</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAssignModal(true)}
        >
          + Assign Asset
        </button>
      </div>


    <div className="row mb-4 search-filter-row">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control search-input rounded-pill border-primary"
            placeholder="Search by asset name, username or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select rounded-pill status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && (
        <>
          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Asset</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentAssets.length === 0 ? (
                  <tr>
                    <td colSpan="5">No records found</td>
                  </tr>
                ) : (
                  currentAssets.map((item, index) => {
                    const isInactive = item.status !== "Active";

                    return (
                      <tr key={item._id}>
                        <td>{indexOfFirst + index + 1}</td>
                        <td>{item.asset?.name || "—"}</td>
                        <td>
                          {item.assignedToUser?.username || "—"} (
                          {item.assignedToUser?.role || "—"})
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "Active"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-1"
                            disabled={isInactive}
                            onClick={() => setEditAsset(item)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            disabled={isInactive}
                            onClick={() => setDeleteAsset(item)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

     
          <div className="d-flex justify-content-center mt-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

 
      {showAssignModal && (
        <AssignModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          refreshList={() => dispatch(fetchAssignedAssets())}
        />
      )}

      {editAsset && (
        <EditAssignModal
          asset={editAsset}
          onClose={() => setEditAsset(null)}
          refreshList={() => dispatch(fetchAssignedAssets())}
        />
      )}

      {deleteAsset && (
        <DeleteAssignModal
          asset={deleteAsset}
          onClose={() => setDeleteAsset(null)}
          refreshList={() => dispatch(fetchAssignedAssets())}
        />
      )}
    </div>
  );
}
