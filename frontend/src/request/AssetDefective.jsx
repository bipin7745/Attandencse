import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchaAssignedDefective } from "../store/assignSlice";
import DeleteModal from "./DeleteModal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AssetDefective() {
  const dispatch = useDispatch();
  const { assignedAssets, loading } = useSelector((state) => state.assign);

  const [deleteAsset, setDeleteAsset] = useState(null);

  useEffect(() => {
    dispatch(fetchaAssignedDefective());
  }, [dispatch]);

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <h2 className="mb-3 text-primary"> DefectiveAssigned  Assets</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Asset Name</th>
                <th>User</th>
                <th>Status</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {assignedAssets.length === 0 ? (
                <tr>
                  <td colSpan="5">No defective assets found</td>
                </tr>
              ) : (
                assignedAssets.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.asset?.name || "—"}</td>
                    <td>
                      {item.assignedToUser?.username || "—"} (
                      {item.assignedToUser?.role || "—"})
                    </td>
                    <td>
                      <span className="badge bg-danger">{item.status}</span>
                    </td>
                    {/* <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteAsset(item)}
                      >
                        <FaTrash />
                      </button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {deleteAsset && (
        <DeleteModal
          asset={deleteAsset}
          onClose={() => setDeleteAsset(null)}
          refreshList={() => dispatch(fetchaAssignedDefective())}
        />
      )}
    </div>
  );
}
