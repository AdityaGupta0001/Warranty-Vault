import { ObjectId } from "mongodb";

export const reminderSchema = {
  userId: ObjectId,
  productId: ObjectId,
  email: String,
  frequency: String, // daily, weekly, monthly, yearly
  startDate: Date,
  nextReminder: Date,
  active: Boolean,
  customMessage: String,
  warrantyExpiryDate: Date,
  warrantyPeriod: {
    years: Number,
    months: Number,
    weeks: Number,
    days: Number,
  },
  warrantyPeriodLeft: {
    years: Number,
    months: Number,
    weeks: Number,
    days: Number,
  },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
};