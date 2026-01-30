import express from "express";
import { createMessage, getMessages } from "../controllers/taskmessageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createMessage);
router.get("/", authMiddleware, getMessages);

export default router;
