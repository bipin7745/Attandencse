import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateIpAddress, fetchIpAddresses } from "../store/ipaddressSlice";
import { toast } from "react-toastify";
import "./EditModal.css";

export default function EditIp({ data, closeModal }) {
  const dispatch = useDispatch();

  const [ip, setIp] = useState(data.ip);
  const [formError, setFormError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!ip) {
      setFormError("IP address is required");
      return;
    }

    // // const ipRegex =
    // //   /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;

    // if (!ipRegex.test(ip)) {
    //   setFormError("Enter a valid IP address");
    //   return;
    // }
    setFormError("");
    setError("");
    setLoading(true);

    try {
      await dispatch(
        updateIpAddress({ id: data._id, ip })
      ).unwrap();

      toast.success("IP Address updated successfully ");
      dispatch(fetchIpAddresses());
      closeModal();
    } catch (err) {
      setError(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit IP Address</h2>

        <form onSubmit={submitHandler}>
          <label className="form-label">IP Address</label>

          <input
            type="text"
            placeholder="Eg: 192.168.1.1"
            value={ip}
            onChange={(e) => {
              setIp(e.target.value);
              setFormError("");
            }}
          />

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>

          {formError && <p className="error">{formError}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
