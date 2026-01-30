import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIpAddresses } from "../store/ipaddressSlice";
import { FaEdit } from "react-icons/fa";
import AddIP from "./AddIP";
import EditIp from "./EditIp";
import "./IPAddress.css";

export default function IPAddress() {
  const dispatch = useDispatch();
  const { ipList } = useSelector((state) => state.ip);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const isIpAdded = ipList.length > 0;

  useEffect(() => {
    dispatch(fetchIpAddresses());
  }, [dispatch]);

  return (
    <div className="ip-container">
      <div className="header-row">
        <h1>IP Address List</h1>
        <button className="open-btn" disabled={isIpAdded} onClick={() => setOpenAdd(true)}>
          + Add IP Address
        </button>
      </div>

      <table className="ip-table">
        <thead>
          <tr>
            <th>No</th>
            <th>IP</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ipList.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.ip}</td>
              <td>
                <FaEdit
                  onClick={() => {
                    setEditData(item);
                    setOpenEdit(true);
                  }}
                  className="edit-icon"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openAdd && <AddIP closeModal={() => setOpenAdd(false)} />}
      {openEdit && (
        <EditIp
          data={editData}
          closeModal={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
}
