import express from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/auth.controllers.js';
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Middleware to protect routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/me", verifyToken, getCurrentUser);

export default router;