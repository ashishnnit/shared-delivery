import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  unreadMessages: {}, // { senderId: unreadCount }
  totalUnreadUserCount: 0, // Total unread messages count

  // Fetch all users with unread counts
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");

      // Transform users to store unread counts
      const users = res.data;
      const unreadMessages = {};

     // console.log("abc");

      users.forEach((user) => {
        unreadMessages[user._id] = user.unreadCount || 0;
      });

      set({
        users,
        unreadMessages,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  // Fetch messages for a specific user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      // Reset unread count for this user
      set((state) => ({
        unreadMessages: {
          ...state.unreadMessages,
          [userId]: 0,
        },
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Fetch user details by ID
  getUserFromId: async (userId) => {
    try {
      const res = await axiosInstance.get(`/messages/userFromId/${userId}`);
      set({ selectedUser: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  // Send a message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // Subscribe to new messages and unread updates
  subscribeToNewMessages: () => {

    console.log("subscribing to new messages");
    
    const { selectedUser,markMessagesAsRead,unreadMessages } = get();
    const { authUser } = useAuthStore.getState();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser) return;
    


    socket.on("newMessage", (newMessage) => {

      if (newMessage.senderId !== selectedUser._id) return;

      socket.emit("markMessagesAsRead", {
        senderId :authUser._id,
        userId: newMessage.senderId,
      });

      markMessagesAsRead(newMessage.senderId);
  
      console.log(unreadMessages[newMessage.senderId]);
      set({
        
        messages: [...get().messages, newMessage],
      });
    });

  },

  // Unsubscribe from socket events
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  // Set the selected user
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  // Mark messages as read
  markMessagesAsRead: (senderId) => {
    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();
    const {unreadMessages} = get();

    if (socket && authUser) {
      socket.emit("markMessagesAsRead", {
        senderId,
        userId: authUser._id,
      });
     

      set((state) => ({
        unreadMessages: {
          ...state.unreadMessages,
          [senderId]: 0,
        },
      }));
    }
    console.log("unreadMessages",unreadMessages[senderId]);
  },

  calculateTotalUnread: () => {
    const { unreadMessages } = get();
    let total = 0;
    
    // Iterate through all senderIds in unreadMessages
    Object.values(unreadMessages).forEach(count => {
      if (count > 0) {
        total += 1;
      }
    });
    
    // Update the totalUnreadCount in state

    set({ totalUnreadUserCount: total });
  },

  //subscribe to global message
}));
