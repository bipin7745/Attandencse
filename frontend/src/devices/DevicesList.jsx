import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { fetchDevices } from "../store/devicesSlice";
import CreateDeviceModal from "./CreateDevices";
import UpdateDeviceModal from "./UpdateDevices";
import DeleteDeviceModal from "./DeleteDevices";
import Pagination from "../layout/Pagination"; 
import "../../public/css/DevicesList.css";

export default function DevicesList() {
  const dispatch = useDispatch();
  const { devices, loading } = useSelector((state) => state.devices);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);


  const handleDelete = (device) => {
    setSelectedDevice(device);
    setShowDelete(true);
  };


  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <div className="header-row">
        <h1>Assets List</h1>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Asset name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="btn-add"
            onClick={() => {
              setSelectedDevice(null);
              setShowCreate(true);
            }}
          >
            <FaPlus /> Add Device
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading devices...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>NAME</th>
                  <th>QUALITY</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentDevices.length === 0 ? (
                  <tr>
                    <td colSpan="5" align="center">
                      No devices found
                    </td>
                  </tr>
                ) : (
                  currentDevices.map((device, index) => (
                    <tr key={device._id}>
                      <td >{indexOfFirstDevice + index + 1}</td>
                      <td align="center">{device.name}</td>
                      <td>{device.quality}</td>
                      <td>{device.status}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setSelectedDevice(device);
                            setShowUpdate(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(device)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

       
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

  
      {showCreate && <CreateDeviceModal close={() => setShowCreate(false)} />}
      {showUpdate && selectedDevice && (
        <UpdateDeviceModal device={selectedDevice} close={() => setShowUpdate(false)} />
      )}
      {showDelete && selectedDevice && (
        <DeleteDeviceModal device={selectedDevice} close={() => setShowDelete(false)} />
      )}
    </div>
  );
}
