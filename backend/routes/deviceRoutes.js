import express from "express";
import { 
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
} from "../controllers/devicesController.js";

const router = express.Router();

// GET all devices
router.get("/", getAllDevices);

// GET single device
router.get("/:id", getDeviceById);

// CREATE device
router.post("/", createDevice);

// UPDATE device
router.put("/:id", updateDevice);

// DELETE device
router.delete("/:id", deleteDevice);

export default router;
