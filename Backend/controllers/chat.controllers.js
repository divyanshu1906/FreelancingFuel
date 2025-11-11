import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Project from "../models/project.model.js";

// Create chat when client accepts freelancer
export const createChat = async (req, res) => {
  try {
    const { projectId, clientId, freelancerId } = req.body;

    // check if chat already exists
    let chat = await Chat.findOne({ projectId, clientId, freelancerId });
    if (!chat) {
      chat = await Chat.create({ projectId, clientId, freelancerId });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all chats for logged-in user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      $or: [{ clientId: userId }, { freelancerId: userId }],
    })
      .populate("projectId", "title")
      .populate("clientId", "name email")
      .populate("freelancerId", "name email");

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages for a chat
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).populate(
      "senderId",
      "name role"
    );
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    const newMessage = await Message.create({
      chatId,
      senderId: req.user.id,
      message,
    });

    // populate sender info before returning
    const populated = await Message.findById(newMessage._id).populate(
      "senderId",
      "name role"
    );

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- New: project-based endpoints used by frontend ChatRoom ---
// Get chat (and its messages) by projectId
export const getChatByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    let chat = await Chat.findOne({ projectId });

    // If no chat exists, try to create one using project data
    if (!chat) {
      const project = await Project.findById(projectId).select("createdBy assignedTo");
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      if (!project.assignedTo) {
        return res.status(404).json({ success: false, message: "Chat not found: project has no assigned freelancer" });
      }

      chat = await Chat.create({
        projectId,
        clientId: project.createdBy,
        freelancerId: project.assignedTo,
      });
    }

    const messages = await Message.find({ chatId: chat._id }).populate(
      "senderId",
      "name role"
    );

    res.status(200).json({ success: true, chat, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message by projectId (find chat first)
export const sendMessageByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;
    let chat = await Chat.findOne({ projectId });

    // If no chat exists, attempt to create one from the project
    if (!chat) {
      const project = await Project.findById(projectId).select("createdBy assignedTo");
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      if (!project.assignedTo) {
        return res.status(404).json({ success: false, message: "Chat not found: project has no assigned freelancer" });
      }

      chat = await Chat.create({
        projectId,
        clientId: project.createdBy,
        freelancerId: project.assignedTo,
      });
    }

    const newMessage = await Message.create({
      chatId: chat._id,
      senderId: req.user.id,
      message,
    });

    // populate sender info before returning
    const populated = await Message.findById(newMessage._id).populate(
      "senderId",
      "name role"
    );

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
