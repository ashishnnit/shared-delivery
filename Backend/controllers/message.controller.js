import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import UnreadMessage from "../models/UnreadMessage.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        // Add unread counts to each user
        const usersWithUnreadCounts = await Promise.all(
            filteredUsers.map(async (user) => {
                const unread = await UnreadMessage.findOne({
                    userId: loggedInUserId,
                    senderId: user._id
                });
                
                return {
                    ...user.toObject(),
                    unreadCount: unread?.count || 0
                };
            })
        );

        res.status(200).json(usersWithUnreadCounts);
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

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
        });

        await newMessage.save();

        // Update unread count
        const unread = await UnreadMessage.findOneAndUpdate(
            { userId: receiverId, senderId: senderId },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
        

        // Send real-time notification
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage);
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