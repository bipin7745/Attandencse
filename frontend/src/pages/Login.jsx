import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../../public/css/Style.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
const { loading, error, userInfo, message } =
  useSelector((state) => state.user);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
    toast.error("Please fill all required fields");
    return;
  }
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
  }
    if (form.password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return;
  }
    dispatch(loginUser(form));
  };

 useEffect(() => {
  if (userInfo?.id) {
    toast.success(message);
    navigate("/project-list");
  }

  if (error) {
    toast.error(error);
  }
}, [userInfo, error, message, navigate]);


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon"><FaEnvelope /></span>
            <input
              type="text"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="input-group">
            <span className="input-icon"><FaLock /></span>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
      </div>
    </div>
  );
}
