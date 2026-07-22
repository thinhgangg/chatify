import User from "../models/User.js";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";

export const authMe = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Error occurred while fetching authenticated user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === "") {
      return res
        .status(400)
        .json({ message: "Username query parameter is required" });
    }

    const users = await User.findOne({ username }).select(
      "_id username displayName avatarUrl",
    );

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error occurred while searching user by username:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: result.secure_url, avatarId: result.public_id },
      { new: true },
    ).select("_id username displayName avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "Failed to update user avatar" });
    }

    return res.status(200).json({
      message: "Avatar uploaded successfully",
      avatarUrl: updatedUser.avatarUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error occurred while uploading avatar:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
