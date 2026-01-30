import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";
import { toast } from "react-toastify";
import Pagination from "../layout/Pagination";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import "../../public/css/UserList.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8800/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedUser(null);
    setDeleteModalOpen(false);
  };
  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8800/api/users/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setDeleting(false);
      closeDeleteModal();
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      setDeleting(false);
      toast.error("Failed to delete user");
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setSelectedUser(null);
    setUpdateModalOpen(false);
  };
  const confirmUpdate = async (updatedData) => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8800/api/users/${selectedUser._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === selectedUser._id ? res.data : u))
      );
      closeUpdateModal();
      toast.success("User updated successfully");
      getUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };
  const indexOfLastUser = currentPage * projectsPerPage;
  const indexOfFirstUser = indexOfLastUser - projectsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / projectsPerPage);

  if (loading)
    return <div className="loader text-center mt-5">Loading users...</div>;

  const isModalOpen = deleteModalOpen || updateModalOpen;

  return (
    <div className={`container ${isModalOpen ? "modal-open" : ""}`}>
      <div className="header-row">
        <h2>All Staff List</h2>
        <button className="btn-add" onClick={() => navigate("/register")}>
          + Add User
        </button>
      </div>

      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
         
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, idx) => (
                  <tr key={user._id}>
                    <td data-label="No">{indexOfFirstUser + idx + 1}</td>
                    <td data-label="Username">{user.username}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Role">{user.role}</td>
                    <td data-label="Action" className="action-buttons">
                      <button
                        className="btn btn-warning"
                        onClick={() => openUpdateModal(user)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => openDeleteModal(user)}
                        disabled={deleting && selectedUser?._id === user._id}
                      >
                        {deleting && selectedUser?._id === user._id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <MdDelete />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
        
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          username={selectedUser?.username}
        />
      )}

      {updateModalOpen && (
        <UpdateModal
          isOpen={updateModalOpen}
          onClose={closeUpdateModal}
          onUpdate={confirmUpdate}
          user={selectedUser}
        />
      )}
    </div>
  );
}
