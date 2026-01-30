import express from "express";
import { sendIPAddress,getIPAddress,updateIPAddress} from "../controllers/ipAddressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/",authMiddleware,sendIPAddress);
router.get("/",authMiddleware,getIPAddress);
router.put("/:id",authMiddleware,updateIPAddress);
export default router;