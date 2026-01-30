import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePassword } from "../store/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../public/css/Profile.css";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = form;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const resultAction = await dispatch(
        changePassword({ oldPassword, newPassword })
      );

      if (changePassword.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload.message || "Password changed successfully!");
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

        // Redirect to profile page
        navigate("/profile/:id");
      } else {
        toast.error(resultAction.payload?.message || "Password change failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={form.oldPassword}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
