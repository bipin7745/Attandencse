import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import "../../public/css/Style.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee",
    autoPassword: false, // ✅ initial false
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, generatedPassword } = useSelector(
    (state) => state.user
  );

  // 🔐 FRONTEND PASSWORD GENERATOR
  const generatePassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // ✅ HANDLE FORM CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // 🔹 checkbox true → auto generate password
      // 🔹 checkbox false → empty password
      setForm((prev) => ({
        ...prev,
        password: checked ? generatePassword() : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ HANDLE FORM SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.email) {
      toast.error("All fields are required");
      return;
    }

    if (!form.autoPassword && !form.password) {
      toast.error("Password is required");
      return;
    }

    dispatch(registerUser(form));
  };

  // ✅ HANDLE RESPONSE
  useEffect(() => {
    if (message) {
      toast.success(message);
      if (generatedPassword) {
        toast.info(`Generated Password: ${generatedPassword}`);
      }
      navigate("/staff");
    }
    if (error) toast.error(error);
  }, [message, error, generatedPassword, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="text"
              name="password"
              placeholder="Password"
              value={form.password}
        
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="autoPassword"
              checked={form.password}
              onChange={handleChange}
            />
            <label>Auto Generate Password</label>
          </div>

          <div className="input-group role-group">
            <FaUserTag className="input-icon" />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="projectmanager">Project Manager</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
