import User from "../models/User.js";

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
