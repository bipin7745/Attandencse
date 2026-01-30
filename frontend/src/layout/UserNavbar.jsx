import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import "../../public/css/Navbar.css";

export default function Navbar() {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const role = userInfo?.role || localStorage.getItem("role");

  const isActive = (path) => location.pathname === path;

  const logoText = () => {
    if (role === "admin") return "Admin Panel";
    if (role === "projectmanager") return "Project List";
    if (role === "employee") return "Employee List";
    return "Dashboard";
  };

  // Close menu on link click
  const handleLinkClick = () => setOpen(false);

  return (
    <nav className="modern-navbar">
      <div className="nav-container">
        <Link to="/login" className="nav-logo" onClick={handleLinkClick}>
          {logoText()}
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links + Profile/Login */}
        <ul className={`nav-links ${open ? "open" : ""}`}>
          {userInfo ? (
            <>
              {/* Admin Links */}
              {role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className={isActive("/dashboard") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/staff"
                      className={isActive("/staff") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Staff List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/project-list"
                      className={isActive("/project-list") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/devices"
                      className={isActive("/devices") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Assets
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/assign"
                      className={isActive("/assign") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      AssignAssets
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defective"
                      className={isActive("/defective") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                       Defective
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/request"
                      className={isActive("/request") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Request
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ipaddress"
                      className={isActive("/ipaddress") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      IP
                    </Link>
                  </li>
                   <li>
                    <Link
                      to="/attendancelist"
                      className={isActive("/attendancelist") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Attendance
                    </Link>
                  </li>
                   <li>
                    <Link
                      to="/requestallList"
                      className={isActive("/requestalllist") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                       RequsetList
                    </Link>
                  </li>
                </>
              )}

  
              {role === "projectmanager" && (
                <>
                  <li>
                    <Link
                      to="/project-list"
                      className={isActive("/project-list") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/assets-assign"
                      className={isActive("/assets-assign") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      AssignAssets
                    </Link>
                  </li>
                   <li>
                    <Link
                      to="/attendance"
                      className={isActive("/attendance") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Attendance
                    </Link>
                  </li>
                  
                </>
              )}

              {/* Employee Links */}
              {role === "employee" && (
                <>
                  <li>
                    <Link
                      to="/project"
                      className={isActive("/project") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Project Assign
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/assets-assign"
                      className={isActive("/assets-assign") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      AssignAssets
                    </Link>
                  </li>
                   <li>
                    <Link
                      to="/attendance"
                      className={isActive("/attendance") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      Attendance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requestlist"
                      className={isActive("/requestlist") ? "active" : ""}
                      onClick={handleLinkClick}
                    >
                      MyRequsetList
                    </Link>
                  </li>
                </>
              )}

              {/* Profile */}
              <li className="profile-section">
                <FaUserCircle className="profile-icon" />
                <Link
                  to={`/profile/${userInfo.id}`}
                  className="username"
                  onClick={handleLinkClick}
                >
                  {userInfo.username}
                </Link>
              </li>
            </>
          ) : (
            // Login Link if no user
            <li>
              <Link
                to="/login"
                className={isActive("/login") ? "active" : ""}
                onClick={handleLinkClick}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
