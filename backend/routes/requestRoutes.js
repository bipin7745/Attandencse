import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {sendAssetRequest,getAllRequests,rejectDeviceRequest,approveDeviceRequest} from "../controllers/requestController.js";

const router = express.Router();

router.post("/", authMiddleware, sendAssetRequest);
router.get("/", authMiddleware, getAllRequests);
router.put("/accept/:id", authMiddleware, approveDeviceRequest);
router.put("/reject/:id",authMiddleware,rejectDeviceRequest);
export default router;
