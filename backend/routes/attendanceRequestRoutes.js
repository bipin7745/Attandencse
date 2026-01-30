import express from "express";
import {
  sendAttendanceRequest,
  getAllRequests,getAllRequestsForUser,approveRequest,rejectRequest
} from "../controllers/attendanceRequestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/request", authMiddleware, sendAttendanceRequest);
router.get("/",authMiddleware,getAllRequests);
router.get("/my-requests", authMiddleware, getAllRequestsForUser);
router.put("/:id/approve", authMiddleware, approveRequest);
router.put("/:id/reject", authMiddleware, rejectRequest);

export default router;
