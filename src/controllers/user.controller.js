import * as userService from "../service/user.service.js";

export const getUser = async (req, res) => {
    try {
        const user = await userService.getUser(req.user.uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.user.uid, req.body);
        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user details" });
    }
};

export const uploadProfilePic = async (req, res) => {
    try {
      const userId = req.user.uid;
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      // Call service function to upload image and update user profile
      const profilePicUrl = await userService.uploadUserProfilePic(userId, file);
  
      return res.json({ message: "Profile picture updated successfully", profilePic: profilePicUrl });
  
    } catch (error) {
      console.error("Error in uploadProfilePic:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };