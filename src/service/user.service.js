import { getDB } from "../config/db.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { userSchema,updateUserSchema } from "../schema/user.schema.js";

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
        const updatedUserData = updateUserSchema({
            ...existingUser,
            ...updates,
            address: { ...existingUser.address, ...updates.address }
        });

        await db.collection(collection).updateOne({ uid }, { $set: updatedUserData });
        
        const updatedUser = await db.collection(collection).findOne({ uid });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Database error");
    }
};

export const uploadUserProfilePic = async (userId, file) => {
    try {
      // Upload to Cloudinary
      const profilePicUrl = await uploadToCloudinary(file, `profile_${userId}`);
  
      // Update user document in MongoDB
      const db = getDB();
      await db.collection("users").updateOne(
        { uid: userId },
        { $set: { profilePic: profilePicUrl } }
      );
  
      return profilePicUrl;
  
    } catch (error) {
      console.error("Error in uploadUserProfilePic:", error);
      throw new Error("Profile picture upload failed");
    }
};
