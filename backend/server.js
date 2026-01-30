import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from './routes/projectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import taskRoutes from "./routes/taskRoutes.js";
import taskmessageRoutes from "./routes/taskmessageRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import ipaddressRoutes from "./routes/ipaddressRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import attendanceRequestRoutes from "./routes/attendanceRequestRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/taskmessage",taskmessageRoutes);
app.use("/api/device",deviceRoutes);
app.use("/api/assign",assetRoutes);
app.use("/api/request",requestRoutes);
app.use("/api/ip",ipaddressRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/requestlist",attendanceRequestRoutes);

app.get("/", (req, res) => {
  res.send(req.ip);
});


const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
