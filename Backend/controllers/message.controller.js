import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import UnreadMessage from "../models/UnreadMessage.model.js";
import UserInteraction from "../models/userInteraction.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        
        // Get all users except the logged-in user
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        // Get interaction data for the logged-in user
        const interactions = await UserInteraction.find({ userId: loggedInUserId });
        
        // Create a map of interacted users with their last interaction time
        const interactionMap = new Map();
        interactions.forEach(interaction => {
            interactionMap.set(
                interaction.interactedWith.toString(), 
                interaction.lastInteraction
            );
        });
        
        // Add unread counts and interaction time to each user
        const usersWithMetadata = await Promise.all(
            allUsers.map(async (user) => {
                const unread = await UnreadMessage.findOne({
                    userId: loggedInUserId,
                    senderId: user._id
                });
                
                return {
                    ...user.toObject(),
                    unreadCount: unread?.count || 0,
                    lastInteraction: interactionMap.get(user._id.toString()) || null
                };
            })
        );

        // Sort users:
        // 1. First by those with recent messages (most recent first)
        // 2. Then by those without any interaction (alphabetically)
        usersWithMetadata.sort((a, b) => {
            if (a.lastInteraction && b.lastInteraction) {
                return b.lastInteraction - a.lastInteraction; // Newest first
            }
            if (a.lastInteraction) return -1; // A has interaction, comes first
            if (b.lastInteraction) return 1;  // B has interaction, comes first
            
            // If neither has interaction, sort alphabetically
            return a.fullName.localeCompare(b.fullName);
        });

        res.status(200).json(usersWithMetadata);
    } catch (err) {
        console.log("Error in getUserForSidebar: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        // Reset unread count when opening chat
        await UnreadMessage.findOneAndUpdate(
            { userId: myId, senderId: userToChatId },
            { count: 0 },
            { upsert: true }
        );

        // Notify client of read status
        const receiverSocketId = getReceiverSocketId(myId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("unreadUpdate", {
                senderId: userToChatId,
                count: 0
            });
        }

        res.status(200).json(messages);
    } catch (err) {
        console.log("Error in getMessages: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Create and save new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
        });

        await newMessage.save();

        const now = new Date();
        
        // Update interaction timestamps for both users
        await UserInteraction.findOneAndUpdate(
            { userId: senderId, interactedWith: receiverId },
            { lastInteraction: now },
            { upsert: true, new: true }
        );
        
        await UserInteraction.findOneAndUpdate(
            { userId: receiverId, interactedWith: senderId },
            { lastInteraction: now },
            { upsert: true, new: true }
        );

        // Update unread count
        await UnreadMessage.findOneAndUpdate(
            { userId: receiverId, senderId: senderId },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );

        // Send real-time notification
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (err) {
        console.log("Error in sendMessage controller: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const userFromId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        res.status(200).json(user);
    } catch (err) {
        console.log("Error in userFromId: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};