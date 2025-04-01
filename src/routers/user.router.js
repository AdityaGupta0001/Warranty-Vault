import express from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/api/user", verifyToken, userController.getUser);
router.put("/api/update-user", verifyToken, userController.updateUser);

export { router as userRouter };
