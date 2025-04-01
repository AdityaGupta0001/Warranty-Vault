import { getDB } from "../config/db.js";
import userSchema from "../schema/auth.schema.js";

const collection = "users";

export const getUser = async (uid) => {
    try {
        const db = getDB();
        return await db.collection(collection).findOne({ uid }, { projection: { password: 0 } });
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Database error");
    }
};

export const updateUser = async (uid, updates) => {
    try {
        const db = getDB();

        // Fetch the current user data
        const existingUser = await db.collection(collection).findOne({ uid });
        if (!existingUser) {
            throw new Error("User not found");
        }

        // Merge existing data with updates while maintaining the schema structure
        const updatedUserData = userSchema({
            ...existingUser,
            ...updates,
            address: { ...existingUser.address, ...updates.address }
        });

        await db.collection(collection).updateOne({ uid }, { $set: updatedUserData });
        return updatedUserData;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Database error");
    }
};
