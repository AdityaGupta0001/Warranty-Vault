import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import productSchema from "../schema/product.schema.js";

const collection = "products";

// Create a new product
export const createProduct = async (productData) => {
    try {
        const db = getDB();
        productData.createdAt = new Date();
        productData.updatedAt = new Date();
        
        const newProduct = productSchema(productData);
        await db.collection(collection).insertOne(newProduct);
        return newProduct;
    } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Database error");
    }
};

// Get all products for a user
export const getUserProducts = async (userId) => {
    try {
        const db = getDB();
        return await db.collection(collection).find({ userId }).toArray();
    } catch (error) {
        console.error("Error fetching user products:", error);
        throw new Error("Database error");
    }
};

// Get a single product by ID
export const getProductById = async (productId) => {
    try {
        const db = getDB();
        return await db.collection(collection).findOne({ _id: new ObjectId(productId) });
    } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error("Database error");
    }
};

// Update a product
export const updateProductById = async (productId, updateData) => {
    try {
        const db = getDB();
        const updatedProductData = {
            ...updateData,
            updatedAt: new Date(),
        };
        await db.collection(collection).updateOne({ _id: new ObjectId(productId)}, { $set: updatedProductData });
        return updatedProductData;
    } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Database error");
    }
};

// Delete a product
export const deleteProductById = async (productId) => {
    try {
        const db = getDB();
        return await db.collection(collection).deleteOne({ _id: new ObjectId(productId) });
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Database error");
    }
};
