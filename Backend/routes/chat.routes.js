import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  createChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  getChatByProject,
  sendMessageByProject,
} from "../controllers/chat.controllers.js";

const router = express.Router();

// Create chat when project is accepted
router.post("/create", verifyToken, createChat);

// Get all chats for a user (client or freelancer)
router.get("/", verifyToken, getUserChats);

// Get messages of a specific chat
router.get("/:chatId/messages", verifyToken, getChatMessages);

// Send a new message
router.post("/:chatId/message", verifyToken, sendMessage);

// Frontend-friendly project-based endpoints
// Get messages (and chat) by projectId
router.get("/project/:projectId", verifyToken, getChatByProject);

// Send message by projectId
router.post("/project/:projectId/send", verifyToken, sendMessageByProject);

export default router;
