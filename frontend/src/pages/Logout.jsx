import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/userSlice";
import { toast } from "react-toastify";

const getTokenExpiryTime = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
   
    if (!token) return;

    const expiryTime = getTokenExpiryTime(token);
    if (!expiryTime) return;

    const remainingTime = expiryTime - Date.now();

    const timer = setTimeout(() => {
      dispatch(logout());
      toast.warning("Token Expired. Please Login Again.");
      navigate("/login");
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);
};

export default useAutoLogout;
