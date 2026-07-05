import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    if (conversationId) {
      // If conversationId is provided, find the existing conversation
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      // If no conversationId is provided or the conversation doesn't exist, create a new conversation
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinAt: new Date() },
          { userId: recipientId, joinAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterMessage(conversation, message, senderId);

    await conversation.save();

    return res
      .status(201)
      .json({ message: "Message sent successfully", message: message });
  } catch (error) {
    console.error("Error sending direct message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterMessage(conversation, message, senderId);

    await conversation.save();

    return res
      .status(201)
      .json({ message: "Message sent successfully", message: message });
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
