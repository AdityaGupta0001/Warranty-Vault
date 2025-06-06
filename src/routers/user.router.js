import express from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verify.jwt.js";
import { uploadProfilePic } from "../controllers/user.controller.js";
import { upload } from "../middleware/file.upload.js";

const router = express.Router();

router.get("/api/user/get-user", verifyToken, userController.getUser);
router.put("/api/user/update-user", verifyToken, userController.updateUser);
router.post("/api/user/upload-profile-pic", verifyToken, upload.single("profilePic"), uploadProfilePic);

export { router as userRouter };
