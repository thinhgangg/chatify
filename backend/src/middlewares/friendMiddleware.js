import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();

    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];

    if (!recipientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Recipient ID or member IDs are required" });
    }

    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);

      const isFriend = await Friend.findOne({ userA, userB });

      if (!isFriend) {
        return res
          .status(403)
          .json({ message: "You are not friends with this user" });
      }

      return next();
    }

    const pairs = memberIds.map((memberId) => {
      const [userA, userB] = pair(me, memberId);
      return { userA, userB };
    });

    const friends = await Friend.find({
      $or: pairs,
    });

    const friendSet = new Set(
      friends.map(
        (friend) => `${friend.userA.toString()}-${friend.userB.toString()}`,
      ),
    );

    const notFriends = memberIds.filter((memberId) => {
      const [userA, userB] = pair(me, memberId);
      return !friendSet.has(`${userA}-${userB}`);
    });

    if (notFriends.length > 0) {
      return res.status(403).json({
        message: "You are not friends with some of the users",
        notFriends,
      });
    }

    next();
  } catch (error) {
    console.error("Error occurred while checking friendship:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkGroupMembership = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    req.conversation = conversation;

    next();
  } catch (error) {
    console.error("Error occurred while checking group membership:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
