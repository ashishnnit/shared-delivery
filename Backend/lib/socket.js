import {Server} from "socket.io";
import http from "http";
import express from "express";
import UnreadMessage from "../models/UnreadMessage.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

// Store online users {userId: socketId}

const userSocketMap = {}; 

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Notify all clients about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle marking messages as read
    socket.on("markMessagesAsRead", async ({ senderId }) => {
        try {
            await UnreadMessage.findOneAndUpdate(
                { userId: socket.handshake.query.userId, senderId },
                { count: 0 }
            );
            
            // Notify all devices of this user
            const receiverSocketId = getReceiverSocketId(socket.handshake.query.userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("unreadUpdate", {
                    senderId,
                    count: 0
                });
            }
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };