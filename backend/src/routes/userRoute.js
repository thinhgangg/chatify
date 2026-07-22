import express from "express";
import {
  authMe,
  searchUserByUsername,
  uploadAvatar,
} from "../controllers/userControllers.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authMe);

router.get("/search", searchUserByUsername);

router.post(
  "/upload-avatar",
  protectedRoute,
  upload.single("file"),
  uploadAvatar,
);

export default router;
