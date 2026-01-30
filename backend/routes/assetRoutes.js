import express from "express";
import { assignAsset, getAssignedAssets,updateAssignedAsset,deleteAssignedAsset,getAssignedAssetsForLoggedInUser, getAssignedDefective } from "../controllers/assignController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/",authMiddleware, assignAsset);
router.get("/assigned", authMiddleware ,getAssignedAssets);
router.get("/defective",authMiddleware ,getAssignedDefective);
router.put("/:id",authMiddleware ,updateAssignedAsset);
router.delete("/:id",authMiddleware,deleteAssignedAsset);
router.get("/my-assets",authMiddleware,getAssignedAssetsForLoggedInUser);
export default router;
