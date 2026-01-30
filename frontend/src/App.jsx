import { Routes, Route } from "react-router-dom";
import UserNavbar from "./layout/UserNavbar.jsx";
import LoginForm from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./layout/Home.jsx";
import Dashboard from "./components/Dashbord.jsx";
import ProjectList from "./components/ProjectList.jsx";
import CreateProject from "./components/CreateProject.jsx";
import AsignProject from "./components/AsignProject.jsx";
import UserList from "./components/UserList.jsx";
import ProjectDetails from "./components/ProjectDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TaskDetails from "./components/TaskDetails.jsx";
import AssignmentByUser from "./Assign/AssignList.jsx";
import DevicesList from "./devices/DevicesList.jsx";
import AssetsAssign from "./Assign/AssetsAssign.jsx";
import RequestList from "./request/Request.jsx";
import AssetDefective from "./request/AssetDefective.jsx";
import IPAddress from "./IP/IPAddress.jsx";
import Attendance from "./Attendance/Attendance.jsx";
import AdminAttendanceList from "./Attendance/AdminAttendanceList.jsx";
import  AttendanceRequestList from "./Attendance/AttendanceRequestlist.jsx";
import MyRequestList from "./Attendance/Requestlist.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

export default function App() {

  return (
    <>
      <UserNavbar />

      <Routes>
        {/* 🌐 Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />

        <Route
          path="/register"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Register />
            </ProtectedRoute>
          }
        />

        {/* 👥 All Logged Users */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "projectmanager", "employee"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["admin", "projectmanager", "employee"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* 👑 Admin Only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devices"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DevicesList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assign"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AssetsAssign />
            </ProtectedRoute>
          }
        />

        <Route
          path="/defective"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AssetDefective />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RequestList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ipaddress"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <IPAddress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets-assign"
          element={
            <ProtectedRoute allowedRoles={["projectmanager", "employee"]}>
              <AssignmentByUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <AsignProject />
            </ProtectedRoute>
          }
        /><Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["projectmanager","employee"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendancelist"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAttendanceList />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/requestalllist"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AttendanceRequestList />
            </ProtectedRoute>
          }
        />
         <Route
          path="/requestlist"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MyRequestList />
            </ProtectedRoute>
          }
        /><Route
          path="/sendrequest"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MyRequestList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/project-create"
          element={
            <ProtectedRoute allowedRoles={["admin", "projectmanager"]}>
              <CreateProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project-list"
          element={
            <ProtectedRoute allowedRoles={["admin", "projectmanager"]}>
              <ProjectList />
            </ProtectedRoute>
          }
        />

        {/* 👷 Employee + Manager + Admin */}
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "projectmanager", "employee"]}>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task-details/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "projectmanager", "employee"]}>
              <TaskDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
