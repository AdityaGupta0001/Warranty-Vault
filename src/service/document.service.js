import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const collection = "products";

export const updateWarrantyDocUrl = async (productId, docUrl) => {
  const db = getDB();
  await db.collection(collection).updateOne(
    { _id: new ObjectId(productId) },
    {
      $set: {
        warrantyDocUrl: docUrl,
        updatedAt: new Date(),
      },
    }
  );
  return await db.collection(collection).findOne({ _id: new ObjectId(productId) });
};

export const getAllDocuments = async (userId) => {
  const db = getDB();
  return await db.collection(collection).find({
    userId,
    warrantyDocUrl: { $exists: true, $ne: null },
  }).toArray();
};

export const removeWarrantyDocUrl = async (productId) => {
  const db = getDB();
  await db.collection(collection).updateOne(
    { _id: new ObjectId(productId) },
    {
      $set: { updatedAt: new Date(), warrantyDocUrl: null },
    }
  );
};

export const getProductById = async (productId) => {
  const db = getDB();
  return await db.collection(collection).findOne({ _id: new ObjectId(productId) });
};
