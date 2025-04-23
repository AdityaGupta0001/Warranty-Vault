import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import * as productService from "../service/product.service.js";
import { getUser } from "./user.service.js";

const collection = "reminders";

function calculateWarrantyPeriodLeft(expiryDate) {
  const now = new Date();
  const end = new Date(expiryDate);
  let diff = Math.max(0, end - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const weeks = Math.floor(((days % 365) % 30) / 7);
  const remainingDays = ((days % 365) % 30) % 7;

  return {
    years,
    months,
    weeks,
    days: remainingDays
  };
}

function addFrequency(date, frequency) {
  const newDate = new Date(date);
  switch (frequency) {
    case "daily":
      newDate.setDate(newDate.getDate() + 1);
      break;
    case "weekly":
      newDate.setDate(newDate.getDate() + 7);
      break;
    case "monthly":
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case "yearly":
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
  }
  return newDate;
}
  
export const createReminder = async (userId, productId, data) => {
  const db = getDB();
  const existingReminder = await db.collection(collection).findOne({ productId });
  if (existingReminder){
    throw new Error("Reminder already exists. Please update the reminder if required.");
  }

  const user = await getUser(userId);
  const product = await productService.getProductById(productId);

  const warrantyExpiryDate = product.warrantyExpiryDate || new Date(data.warrantyExpiryDate);
  const warrantyPeriodLeft = calculateWarrantyPeriodLeft(warrantyExpiryDate);
  
  const reminder = {
    userId: userId,
    productId: productId,
    email: user.email,
    frequency: data.frequency,
    startDate: new Date(data.startDate) || new Date(),
    nextReminder: addFrequency(data.startDate, data.frequency),
    active: true,
    customMessage: data.customMessage || "",
    warrantyExpiryDate: product.warrantyExpiryDate || new Date(data.warrantyExpiryDate),
    warrantyPeriod: product.warrantyPeriod || data.warrantyPeriod,
    warrantyPeriodLeft: warrantyPeriodLeft,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try{
    const result = await db.collection(collection).insertOne(reminder);
    return result.ops?.[0] || reminder;
  }
  catch(error){
    console.error("Error creating reminder:", error);
    throw new Error("Reminder error");
  }
};

export const getRemindersByUser = async (userId) => {
  const db = getDB();
  return await db.collection(collection).find({ userId }).toArray();
};

export const updateReminder = async (reminderId, data) => {
  const db = getDB();
  const existingReminder = await db.collection(collection).find({ _id: new ObjectId(reminderId) });
  if (!existingReminder){
    throw new Error("Reminder not found.");
  }
  await db.collection(collection).updateOne(
    { _id: new ObjectId(reminderId) },
    { $set: { ...data, nextReminder: addFrequency(data.startDate || existingReminder.startDate, data.frequency),updatedAt: new Date() } }
  );
  return await db.collection(collection).findOne({ _id: new ObjectId(reminderId) });
};

export const deleteReminder = async (reminderId) => {
  const db = getDB();
  await db.collection(collection).deleteOne({ _id: new ObjectId(reminderId) });
};
