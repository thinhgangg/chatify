import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized: Access token is missing"));
    }

    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedUser) {
      return next(new Error("Unauthorized: Invalid access token"));
    }

    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword",
    );
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error(
      "Error occurred while verifying token in socket middleware:",
      error,
    );
    return next(new Error("Unauthorized: Internal server error"));
  }
};
