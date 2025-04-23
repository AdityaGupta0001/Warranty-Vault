import * as reminderService from "../service/reminder.service.js";

export const createReminder = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.uid;
    const reminderData = req.body;
    const result = await reminderService.createReminder(userId, productId, reminderData);
    res.status(201).json(result);
  } catch (err) {
    console.error("Create Reminder Error:", err);
    res.status(500).json({ message: "Failed to create reminder.", error: err.message});
  }
};

export const getAllReminders = async (req, res) => {
  try {
    const userId = req.user.uid;
    const reminders = await reminderService.getRemindersByUser(userId);
    res.status(200).json(reminders);
  } catch (err) {
    console.error("Fetch Reminders Error:", err);
    res.status(500).json({ message: "Failed to fetch reminders." });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const updated = await reminderService.updateReminder(reminderId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Reminder Error:", err);
    res.status(500).json({ message: "Failed to update reminder." });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    await reminderService.deleteReminder(reminderId);
    res.status(200).json({ message: "Reminder deleted." });
  } catch (err) {
    console.error("Delete Reminder Error:", err);
    res.status(500).json({ message: "Failed to delete reminder." });
  }
};