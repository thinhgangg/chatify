import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30s"; // Access token time to live
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // Refresh token time to live

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstname, lastname } = req.body;

    if (!username || !password || !email || !firstname || !lastname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstname} ${lastname}`,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error occurred while signing up user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    // get the username and password
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // get the hashed password from the database to compare with the password
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // if correct create access token with jwt
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // create refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // create new session and save refresh token to database
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // return refresh token to cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // return access token to res
    return res.status(200).json({ message: "Sign in successful", accessToken });
  } catch (error) {
    console.error("Error occurred while signing in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    // get the refresh token from the cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // delete refresh token from cookie
      await Session.deleteOne({ refreshToken: token });

      // delete cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error occurred while signing out user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// create a new access token using the refresh token
export const refreshToken = async (req, res) => {
  try {
    // get the refresh token from the cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // compare the refresh token with the one in the database
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // check if the refresh token is expired
    if (session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // create a new access token
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error occurred while refreshing token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
