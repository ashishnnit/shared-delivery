import {Server} from "socket.io";
import http from "http";
import express from "express";
import UnreadMessage from "../models/unreadMessage.model.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173","https://shared-delivery-frontend.onrender.com"]
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
    socket.on("markMessagesAsRead", async ({ senderId, userId }) => {
        try {
            await UnreadMessage.findOneAndUpdate(
                { userId, senderId },
                { count: 0 }
            );
            
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



