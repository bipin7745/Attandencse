import express from "express";
import { registerUser, loginUser, getNonAdminUsers,getProfile,
  updateUser,
  deleteUser, 
  changePassword} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware,getProfile );
router.get("/users", getNonAdminUsers);
router.put("/users/:id",  authMiddleware,updateUser);
router.put("/change-password",authMiddleware,changePassword);
router.delete("/users/:id",authMiddleware, deleteUser);


export default router;
