import express from "express";
import { verifyToken } from "../middleware/verify.jwt.js";
import * as reminderController from "../controllers/reminder.controller.js";

const router = express.Router();

router.post("/api/reminders/:productId", verifyToken, reminderController.createReminder);
router.get("/api/reminders", verifyToken, reminderController.getAllReminders);
router.put("/api/reminders/:reminderId", verifyToken, reminderController.updateReminder);
router.delete("/api/reminders/:reminderId", verifyToken, reminderController.deleteReminder);

export { router as reminderRouter };
