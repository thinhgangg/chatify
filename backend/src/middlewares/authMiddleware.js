import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authorization middleware to protect routes
export const protectedRoute = async (req, res, next) => {
  try {
    // get token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    // verify the token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error("Error occurred while verifying token:", err);
          return res.status(403).json({ message: "Invalid access token" });
        }

        // get the user from the database
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // return the user in the response
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Error occurred while verifying token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
