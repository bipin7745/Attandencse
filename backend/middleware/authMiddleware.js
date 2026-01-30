import jwt from "jsonwebtoken";
import User from "../models/User.js";
import IPAddress from "../models/IPAddress.js";
import { getClientIp } from "../utils/getClientIp.js";

export const authMiddleware = async (req, res, next) => {
  try {
  
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now(); 
    const remainingTime = expiryTime - currentTime;
    
    if (remainingTime <= 0)
    {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    if (user.role !== "admin") {
      const clientIp = await getClientIp(req);
      const ipList = await IPAddress.find(); 

      const authorized = ipList.some(record => record.ip === clientIp);
      if (!authorized) {
        return res.status(401).json({ message: "Token expired. IP change" });
      }
    }

    req.user = user;
    next();

  }
   catch (error)
   {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};
