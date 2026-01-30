import express from "express";
import {
  checkIn,
  checkOut,
  fetchAttendance,fetchAllAttendance,fetchAttendanceById,updateAttendanceStatus
} from "../controllers/attendanceController.js";
import { sendAttendanceRequest,getAllRequests } from "../controllers/attendanceRequestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/check-in", authMiddleware ,checkIn);
router.post("/check-out",authMiddleware, checkOut);
router.get("/user",authMiddleware, fetchAttendance);
router.get("/all",authMiddleware,fetchAllAttendance);
router.put("/attendance/:id",authMiddleware, fetchAttendanceById);
router.put("/status/:id", authMiddleware, updateAttendanceStatus);
router.post("/request", authMiddleware, sendAttendanceRequest);
router.get("/",authMiddleware,getAllRequests);
export default router;
