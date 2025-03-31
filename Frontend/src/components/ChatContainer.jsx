import React, { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessageLoading,
        selectedUser,
        subscribeToNewMessages,
        unsubscribeFromMessages,
        markMessagesAsRead,
        unreadMessages,
    } = useChatStore();

    const { authUser, socket, connectSocket } = useAuthStore();
    const messagesEndRef = useRef(null);

    useEffect(() => {
       if (!socket) {
            connectSocket();
        }
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToNewMessages();
        }

        return () => {
            // Clean up subscriptions when component unmounts or selectedUser changes
            unsubscribeFromMessages();
            
        };
    }, [selectedUser?._id, socket, getMessages, subscribeToNewMessages, unsubscribeFromMessages, connectSocket]);

    // Effect to scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [messages]);

    if (isMessageLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader/>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <MessageSkeleton count={5}/>
                </div>
                <MessageInput/>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                    const isLastMessage = index === messages.length - 1;
                    return (
                        <div 
                            key={message._id} 
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                            ref={isLastMessage ? messagesEndRef : null}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img 
                                        src={message.senderId === authUser._id 
                                            ? authUser.profilePic || "/avatar.png" 
                                            : selectedUser.profilePic || "/avatar.png"} 
                                        alt="profile" 
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <MessageInput/>
        </div>
    );
};

export default ChatContainer;