import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/userSlice";
import { fetchProjects, fetchTasks } from "../store/projectSlice";
import { fetchDevices } from "../store/devicesSlice";
import { fetchaAssignedDefective, fetchAssignedAssets } from "../store/assignSlice";
import {
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaLaptop,
  FaExclamationTriangle,
} from "react-icons/fa";
import "../../public/css/Dashboard.css";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  const { projects, tasks, loading: projectLoading, error: projectError } =
    useSelector((state) => state.project);
  const { devices, loading: devicesLoading, error: devicesError } =
    useSelector((state) => state.devices);
  const { assignedAssets, loading: assignLoading, error: assignError } =
    useSelector((state) => state.assign);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchDevices());
    dispatch(fetchaAssignedDefective());
  }, [dispatch]);

  const loading = projectLoading || devicesLoading || assignLoading;
  const error = projectError || devicesError || assignError;

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard </h1>

      <div className="stats-container">
        <div className="stat-card staff">
          <div className="stat-icon"><FaUsers /></div>
          <div>
            <h3>Total Staff</h3>
            <p>{users?.length || 0}</p>
          </div>
        </div>

        <div className="stat-card projects">
          <div className="stat-icon"><FaProjectDiagram /></div>
          <div>
            <h3>Total Projects</h3>
            <p>{projects?.length || 0}</p>
          </div>
        </div>

        <div className="stat-card tasks">
          <div className="stat-icon"><FaTasks /></div>
          <div>
            <h3>Total Tasks</h3>
            <p>{tasks?.length || 0}</p>
          </div>
        </div>

        <div className="stat-card devices">
          <div className="stat-icon"><FaLaptop /></div>
          <div>
            <h3>Total Devices</h3>
            <p>{devices?.length || 0}</p>
          </div>
        </div>

        <div className="stat-card assigned">
          <div className="stat-icon"><FaExclamationTriangle /></div>
          <div>
            <h3>Total Defective Assets</h3>
            <p>{assignedAssets?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
