import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { socketService } from '../services/socketService';
import { chatApi } from '../services/chatApi';
import { Chat, Message, User } from '../components/chat/types';

interface ChatContextType {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  onlineUsers: string[];
  currentUserId: string;
  setSelectedChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  loadMessages: (roomId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  markRoomAsRead: (roomId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  currentUserId: string;
}

export const ChatProvider = ({ children, currentUserId }: ChatProviderProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect(currentUserId);

    // Listen for new messages
    socketService.onNewMessage((message: Message) => {
      setMessages(prev => [...prev, message]);
      
      // Update last message in chats
      setChats(prev => prev.map(chat => 
        chat.roomId === message.roomId 
          ? { ...chat, lastMessage: message, unreadCount: chat.unreadCount + 1 }
          : chat
      ));
    });

    // Listen for user status changes
    socketService.onUserOnline((userId: string) => {
      setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId]);
    });

    socketService.onUserOffline((userId: string) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    // Load initial conversations
    loadConversations();

    return () => {
      socketService.disconnect();
    };
  }, [currentUserId]);

  const loadConversations = async () => {
    try {
      const conversations = await chatApi.getConversations();
      // Transform conversations to chats format
      // This is a simplified transformation - you may need to adjust based on actual API response
      setChats(conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const messagesData = await chatApi.getMessages(roomId);
      setMessages(messagesData);
      
      // Join the room for real-time updates
      socketService.joinRoom(roomId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedChat) return;

    try {
      const messageData = {
        senderId: currentUserId,
        receiverId: selectedChat.user.id,
        roomId: selectedChat.roomId,
        content
      };

      // Send via API
      await chatApi.sendMessage(messageData);
      
      // Send via socket for real-time delivery
      socketService.sendMessage(messageData);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const markRoomAsRead = async (roomId: string) => {
    try {
      await chatApi.markRoomAsRead(roomId);
      
      // Update local state
      setChats(prev => prev.map(chat => 
        chat.roomId === roomId 
          ? { ...chat, unreadCount: 0 }
          : chat
      ));
    } catch (error) {
      console.error('Failed to mark room as read:', error);
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      selectedChat,
      messages,
      onlineUsers,
      currentUserId,
      setSelectedChat,
      sendMessage,
      loadMessages,
      loadConversations,
      markRoomAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};















src/
├── components/
│   └── chat/
│       ├── ChatLayout.jsx
│       ├── ChatLayout.module.css
│       ├── ChatList.jsx
│       ├── ChatList.module.css
│       ├── ChatListItem.jsx
│       ├── ChatListItem.module.css
│       ├── ChatWindow.jsx
│       ├── ChatWindow.module.css
│       ├── MessageBubble.jsx
│       ├── MessageBubble.module.css
│       └── types.ts
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useChat.ts
└── services/
    ├── chatApi.ts
    └── socketService.ts     .. above is my folder structure  ..  ChatLayout.module.css 
.container {
  display: flex;
  height: 100vh;
  background-color: #000000;
  color: #ffffff;
   width: 100%;
  overflow: hidden;
}

.chatList {
  width: 100%;
  border-right: 1px solid #1f2937;
  display: flex;
  flex-direction: column;
   transition: transform 0.3s ease;
}

@media (min-width: 640px) {
  .chatList {
    width: clamp(280px, 30%, 320px);
  }
}

@media (min-width: 1024px) {
  .chatList {
    width: clamp(320px, 25%, 384px);
  }
}

.chatListHidden {
  display: none;
}

.chatWindow {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.chatWindowHidden {
  display: none;
}

.emptyState {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  padding: 1rem;
}

.emptyStateContent {
  text-align: center;
  color: #9ca3af;
}

.emptyStateIcon {
  font-size: clamp(2.5rem, 8vw, 4rem);
  margin-bottom: 1rem;
}

.emptyStateTitle {
   font-size: clamp(1rem, 4vw, 1.25rem);
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.emptyStateDescription {
   font-size: clamp(0.75rem, 3vw, 0.875rem);
  max-width: 80%;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .chatListHidden,
  .chatWindowHidden {
    display: flex;
  }
}  ChatLayout.tsx 
import { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { Chat } from "./types";
import { useChat } from "../../hooks/useChat";
import styles from "./ChatLayout.module.css";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const {
    conversations,
    messages,
    loading,
    onlineUsers,
    typingUsers,
    loadConversations,
    loadMessages,
    sendMessage,
    sendTyping,
    markMessagesAsRead,
  } = useChat();

  useEffect(() => {
    // Load conversations on mount

    loadConversations();
  }, [loadConversations]);


  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    loadMessages(chat.id);
    markMessagesAsRead(chat.id);
  };

  if (loading && conversations.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateIcon}>⏳</div>
            <h2 className={styles.emptyStateTitle}>Loading chats...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Chat List - Hidden on mobile when chat is selected */}
      <div className={`${styles.chatList} ${
        isMobile && selectedChat ? styles.chatListHidden : ''
      }`}>
        <ChatList 
          chats={conversations}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
        />
      </div>

      {/* Chat Window - Hidden on mobile when no chat selected */}
      <div className={`${styles.chatWindow} ${
        isMobile && !selectedChat ? styles.chatWindowHidden : ''
      }`}>
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat}
            messages={messages[selectedChat.id] || []}
            onBack={() => setSelectedChat(null)}
            onSendMessage={(content) => sendMessage(selectedChat.id, content, selectedChat.user.id)}
            onTyping={(isTyping) => sendTyping(selectedChat.id, isTyping)}
            typingUsers={typingUsers[selectedChat.id] || []}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateContent}>
              <div className={styles.emptyStateIcon}>💬</div>
              <h2 className={styles.emptyStateTitle}>Your Messages</h2>
              <p className={styles.emptyStateDescription}>Send messages to a friend.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;  ChatList.module.css 
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
   width: 100%;
}

.header {
  padding: clamp(0.75rem, 2vw, 1rem);
  border-bottom: 1px solid #1f2937;
}

.headerTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
 margin-bottom: clamp(0.5rem, 2vw, 1rem);
}

.title {
  font-size: clamp(1rem, 4vw, 1.25rem);
  font-weight: 600;
}

.editButton {
  padding: clamp(0.4rem, 1.5vw, 0.5rem);
  background: none;
  border: none;
  color: #ffffff;
  border-radius: 50%;
  transition: background-color 0.2s;
  cursor: pointer;
}

.editButton:hover {
  background-color: #1f2937;
}

.searchContainer {
  position: relative;
  width: 100%;
}

.searchIcon {
  position: absolute;
  left: clamp(0.5rem, 2vw, 0.75rem);
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.searchInput {
  width: 80%;
  background-color: #1f2937;
  color: #ffffff;
  padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.75rem, 2.5vw, 1rem) clamp(0.4rem, 1.5vw, 0.5rem) clamp(2rem, 5vw, 2.5rem);
  border-radius: clamp(0.4rem, 1.5vw, 0.5rem);
  border: none;
  outline: none;
  transition: background-color 0.2s;
  font-size: clamp(0.8rem, 3vw, 0.875rem);
}

.searchInput::placeholder {
  color: #9ca3af;
}

.searchInput:focus {
  background-color: #374151;
}

.chatListContainer {
  flex: 1;
  overflow-y: auto;
   width: 100%;
}

.emptyState {
 padding: clamp(0.75rem, 2vw, 1rem);
  text-align: center;
  color: #9ca3af;
  font-size: clamp(0.8rem, 3vw, 0.875rem);
}   ChatList.jsx import { useState } from "react";
import { Search, Edit } from "lucide-react";
import { Chat } from "./types";
import ChatListItem from "./ChatListItem";
import styles from "./ChatList.module.css";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

const ChatList = ({ chats, selectedChat, onChatSelect }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(chat =>
    chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Message</h1>
          <button className={styles.editButton}>
            <Edit size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={16} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className={styles.chatListContainer}>
        {filteredChats.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => onChatSelect(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;  ChatListItem.module.css 
.container {
  display: flex;
  align-items: center;
   padding: clamp(0.75rem, 2vw, 1rem);
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.container:hover {
  background-color: #111827;
}

.selected {
  background-color: #1f2937;
}

.avatarContainer {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: clamp(2.5rem, 8vw, 3rem);
  height: clamp(2.5rem, 8vw, 3rem);
  border-radius: 50%;
  object-fit: cover;
}

.onlineIndicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: clamp(0.6rem, 2vw, 0.75rem);
  height: clamp(0.6rem, 2vw, 0.75rem);
  background-color: #10b981;
  border: 2px solid #000000;
  border-radius: 50%;
}

.chatInfo {
  margin-left: clamp(0.5rem, 2vw, 0.75rem);
  flex: 1;
  min-width: 0;
}

.topRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.username {
  font-weight: 500;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: clamp(0.875rem, 3.5vw, 1rem);

}

.timestamp {
  font-size: clamp(0.65rem, 2.5vw, 0.75rem);
  color: #9ca3af;
  flex-shrink: 0;
 margin-left: clamp(0.4rem, 1.5vw, 0.5rem);
}

.bottomRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: clamp(0.2rem, 1vw, 0.25rem);
}

.lastMessage {
   font-size: clamp(0.75rem, 3vw, 0.875rem);
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lastMessageUnread {
  color: #ffffff;
  font-weight: 500;
}

.unreadBadge {
  flex-shrink: 0;
 margin-left: clamp(0.4rem, 1.5vw, 0.5rem);
}

.unreadCount {
  background-color: #3b82f6;
  color: #ffffff;
 font-size: clamp(0.65rem, 2.5vw, 0.75rem);
  border-radius: 50%;
  padding: clamp(0.2rem, 1vw, 0.25rem) clamp(0.4rem, 1.5vw, 0.5rem);
  min-width: clamp(1rem, 3vw, 1.25rem);
  text-align: center;
}  ChatListItem.tsx  
import { Chat } from "./types";
import styles from "./ChatListItem.module.css";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${styles.container} ${isSelected ? styles.selected : ''}`}
    >
      {/* Avatar */}
      <div className={styles.avatarContainer}>
        <img
          src={chat.user.avatar}
          alt={chat.user.username}
          className={styles.avatar}
        />
        {chat.user.isOnline && (
          <div className={styles.onlineIndicator}></div>
        )}
      </div>

      {/* Chat Info */}
      <div className={styles.chatInfo}>
        <div className={styles.topRow}>
          <span className={styles.username}>
            {chat.user.username}
          </span>
          <span className={styles.timestamp}>
            {formatTime(chat.lastMessage.timestamp)}
          </span>
        </div>
        
        <div className={styles.bottomRow}>
          <p className={`${styles.lastMessage} ${
            chat.unreadCount > 0 ? styles.lastMessageUnread : ''
          }`}>
            {chat.lastMessage.senderId === 'current' && 'You: '}
            {chat.lastMessage.text}
          </p>
          
          {chat.unreadCount > 0 && (
            <div className={styles.unreadBadge}>
              <span className={styles.unreadCount}>
                {chat.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;  ChatWindow.module.css  
.container {
  display: flex;
  flex-direction: column;
height: 100%;
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
 padding: clamp(0.75rem, 2vw, 1rem);
  border-bottom: 1px solid #1f2937;
}

.headerLeft {
  display: flex;
  align-items: center;
}

.backButton {
   padding: clamp(0.4rem, 1.5vw, 0.5rem);
  background: none;
  border: none;
  color: #ffffff;
  border-radius: 50%;
  transition: background-color 0.2s;
  margin-right: clamp(0.4rem, 1.5vw, 0.5rem);
  cursor: pointer;
}

.backButton:hover {
  background-color: #1f2937;
}

@media (min-width: 640px) {
  .backButton {
    display: none;
  }
}

.avatarContainer {
  position: relative;
}

.avatar {
  width: clamp(1.75rem, 6vw, 2rem);
  height: clamp(1.75rem, 6vw, 2rem);
  border-radius: 50%;
  object-fit: cover;
}

.onlineIndicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: clamp(0.5rem, 1.5vw, 0.625rem);
  height: clamp(0.5rem, 1.5vw, 0.625rem);
  background-color: #10b981;
  border: 1px solid #000000;
  border-radius: 50%;
}

.userInfo {
  margin-left: clamp(0.5rem, 2vw, 0.75rem);
}

.username {
  font-weight: 500;
  font-size: clamp(0.875rem, 3.5vw, 1rem);
}

.status {
  font-size: clamp(0.65rem, 2.5vw, 0.75rem);
  color: #9ca3af;
}

.headerRight {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
}

.actionButton {
padding: clamp(0.4rem, 1.5vw, 0.5rem);
  background: none;
  border: none;
  color: #ffffff;
  border-radius: 50%;
  transition: background-color 0.2s;
  cursor: pointer;
}

.actionButton:hover {
  background-color: #1f2937;
}

.messagesContainer {
  flex: 1;
  overflow-y: auto;
  padding: clamp(0.75rem, 2vw, 1rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 2vw, 1rem);
}

.typingIndicator {
  display: flex;
  align-items: center;
  gap: clamp(0.4rem, 1.5vw, 0.5rem);
  padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
  max-width: clamp(20rem, 80%, 24rem);
}

.typingDots {
  display: flex;
  gap: clamp(0.2rem, 1vw, 0.25rem);
  padding: clamp(0.5rem, 2vw, 0.75rem);
  background-color: #1f2937;
  border-radius: clamp(0.75rem, 2.5vw, 1rem);
}

.typingDots span {
  width: clamp(0.4rem, 1.5vw, 0.5rem);
  height: clamp(0.4rem, 1.5vw, 0.5rem);
  background-color: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typingDots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typingDots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.typingText {
  font-size: 0.75rem;
  color: #9ca3af;
}

.inputContainer {
 padding: clamp(0.75rem, 2vw, 1rem);
  border-top: 1px solid #1f2937;
}

.inputWrapper {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 0.75rem);
}

.inputField {
  flex: 1;
  position: relative;
}

.messageInput {
  width: 100%;
  background-color: #1f2937;
  color: #ffffff;
  padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
  padding-right: clamp(4rem, 10vw, 5rem);
  border-radius: clamp(25px, 5vw, 50px);
  border: none;
  outline: none;
  transition: background-color 0.2s;
  font-size: clamp(0.8rem, 3vw, 0.875rem);
}

.messageInput::placeholder {
  color: #9ca3af;
}

.messageInput:focus {
  background-color: #374151;
}

.inputActions {
   position: absolute;
  right: clamp(0.5rem, 2vw, 0.75rem);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: clamp(0.4rem, 1.5vw, 0.5rem);
}

.inputActionButton {
   padding: clamp(0.2rem, 1vw, 0.25rem);
  background: none;
  border: none;
  color: #9ca3af;
  border-radius: 50%;
  transition: background-color 0.2s;
  cursor: pointer;
}

.inputActionButton:hover {
  background-color: #374151;
}

.sendButton {
  padding: clamp(0.4rem, 1.5vw, 0.5rem);
  background: none;
  border: none;
  border-radius: 50%;
  transition: background-color 0.2s;
  cursor: pointer;
}

.sendButtonActive {
  color: #3b82f6;
}

.sendButtonActive:hover {
  background-color: #1f2937;
}

.sendButtonInactive {
  color: #4b5563;
  cursor: not-allowed;
}   ChatWindow.tsx 
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Phone, Video, Info, Send, Smile, Image } from "lucide-react";
import { Chat, Message } from "./types";
import MessageBubble from "./MessageBubble";
import styles from "./ChatWindow.module.css";

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  typingUsers: string[];
}

const ChatWindow = ({ 
  chat, 
  messages, 
  onBack, 
  onSendMessage, 
  onTyping, 
  typingUsers 
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
      handleStopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      onTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      onTyping(false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={onBack}
            className={styles.backButton}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className={styles.avatarContainer}>
            <img
              src={chat.user.avatar}
              alt={chat.user.username}
              className={styles.avatar}
            />
            {chat.user.isOnline && (
              <div className={styles.onlineIndicator}></div>
            )}
          </div>
          
          <div className={styles.userInfo}>
            <h2 className={styles.username}>{chat.user.username}</h2>
            <p className={styles.status}>
              {chat.user.isOnline ? 'Active now' : 'Active 2h ago'}
            </p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.actionButton}>
            <Phone size={20} />
          </button>
          <button className={styles.actionButton}>
            <Video size={20} />
          </button>
          <button className={styles.actionButton}>
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === "current"}
          />
        ))}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className={styles.typingText}>
              {chat.user.username} is typing...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <div className={styles.inputField}>
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={handleStopTyping}
              placeholder="Message..."
              className={styles.messageInput}
            />
            
            <div className={styles.inputActions}>
              <button className={styles.inputActionButton}>
                <Smile size={16} />
              </button>
              <button className={styles.inputActionButton}>
                <Image size={16} />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`${styles.sendButton} ${
              newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;  MessageBubble.module.css 
.container {
  display: flex;
  width: 100%;
  padding: clamp(0.5rem, 2vw, 0.75rem);
}

.containerOwn {
  justify-content: flex-end;
}

.containerOther {
  justify-content: flex-start;
}

.messageWrapper {
  max-width: clamp(60%, 80vw, 70%);
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .messageWrapper {
   max-width: clamp(60%, 80vw, 70%);
  display: flex;
  flex-direction: column;
  }
}

@media (min-width: 1280px) {
  .messageWrapper {
   max-width: clamp(60%, 80vw, 70%);
  display: flex;
  flex-direction: column;
  }
}

.messageWrapperOwn {
  align-items: flex-end;
}

.messageWrapperOther {
  align-items: flex-start;
}

.messageBubble {
  padding: clamp(0.5rem, 2vw, 0.75rem);
  border-radius: clamp(0.75rem, 2.5vw, 1rem);
  max-width: 100%;
}

.messageBubbleOwn {
  background-color: #3b82f6;
  color: #ffffff;
}

.messageBubbleOther {
  background-color: #1f2937;
  color: #ffffff;
  
}

.messageText {
  font-size: clamp(0.8rem, 3vw, 0.875rem);
  word-break: break-word;
}

.timestamp {
 font-size: clamp(0.65rem, 2.5vw, 0.75rem);
  color: #9ca3af;
  margin-top: clamp(0.2rem, 1vw, 0.25rem);
}

.timestampOwn {
  text-align: right;
}

.timestampOther {
  text-align: left;
}  MessageBubble.tsx 
import { Message } from "./types";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`${styles.container} ${isOwn ? styles.containerOwn : styles.containerOther}`}>
      <div className={`${styles.messageWrapper} ${isOwn ? styles.messageWrapperOwn : styles.messageWrapperOther}`}>
        <div
          className={`${styles.messageBubble} ${
            isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther
          }`}
        >
          <p className={styles.messageText}>{message.text}</p>
        </div>
        
        <div className={`${styles.timestamp} ${isOwn ? styles.timestampOwn : styles.timestampOther}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;  types.ts 
export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  roomId: any;
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  isRead: boolean;
  type?: 'text' | 'image' | 'emoji';
}

export interface Chat {
  roomId: any;
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}   AuthContext.tsx import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
  verifyOTP: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("instagram_user");
    

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("instagram_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://172.50.5.102:3011/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (data.requiresOTP) {
          return { success: true, requiresOTP: true };
        }

        setUser(data.access_token);
        localStorage.setItem(
          "instagram_user",
          JSON.stringify(data.access_token)
        );
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      // Mock successful login for demo purposes
      const mockUser: User = {
        id: "1",
        username: email.split("@")[0],
        email,
        fullName: "Demo User",
        bio: "Welcome to Instagram clone!",
        profilePicture: "",
        emailVerified: true,
      };

      setUser(mockUser);
      localStorage.setItem("instagram_user", JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          emailVerified: false,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        return { success: true, requiresOTP: true };
      } else {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }
    } catch (error) {
      // Mock successful registration for demo purposes
      return { success: true, requiresOTP: true };
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        const mockUser: User = {
          id: "1",
          username: email.split("@")[0],
          email,
          fullName: "New User",
          bio: "Welcome to Instagram!",
          profilePicture: "",
          emailVerified: true,
        };

        setUser(mockUser);
        // localStorage.setItem("instagram_user", JSON.stringify(mockUser));
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "OTP verification failed",
        };
      }
    } catch (error) {
      // Mock successful OTP verification for demo purposes
      const mockUser: User = {
        id: "1",
        username: email.split("@")[0],
        email,
        fullName: "New User",
        bio: "Welcome to Instagram!",
        profilePicture: "",
        emailVerified: true,
      };

      setUser(mockUser);
      // localStorage.setItem("instagram_user", JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    // localStorage.removeItem("instagram_user");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    verifyOTP,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
  useChat.ts  import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services/socketService';
import { chatApi, ApiMessage, ApiConversation } from '../services/chatApi';
import { Chat, Message, User } from '../components/chat/types';

// Mock current user - replace with actual auth context
const CURRENT_USER_ID = 'current_user_id';

export const useChat = () => {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({});
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<{ [roomId: string]: string[] }>({});
  const typingTimeoutRef = useRef<{ [roomId: string]: NodeJS.Timeout }>({});

  // Initialize socket connection
  useEffect(() => {
    socketService.connect(CURRENT_USER_ID);

    // Listen for new messages
    socketService.onNewMessage((apiMessage) => {
      const message = convertApiMessageToMessage(apiMessage);
      setMessages(prev => ({
        ...prev,
        [apiMessage.roomId]: [...(prev[apiMessage.roomId] || []), message]
      }));

      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === apiMessage.roomId 
            ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount + 1 }
            : conv
        )
      );
    });

    // Listen for message status updates
    socketService.onMessageStatusUpdate(({ messageId, status }) => {
      setMessages(prev => {
        const newMessages = { ...prev };
        Object.keys(newMessages).forEach(roomId => {
          newMessages[roomId] = newMessages[roomId].map(msg =>
            msg.id === messageId
              ? { ...msg, isRead: status === 'read' ? true : msg.isRead }
              : msg
          );
        });
        return newMessages;
      });
    });

    // Listen for user status changes
    socketService.onUserStatusChange(({ userId, isOnline }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    // Listen for typing indicators
    socketService.onTyping(({ userId, roomId, isTyping }) => {
      setTypingUsers(prev => {
        const roomTyping = prev[roomId] || [];
        if (isTyping && !roomTyping.includes(userId)) {
          return { ...prev, [roomId]: [...roomTyping, userId] };
        } else if (!isTyping) {
          return { ...prev, [roomId]: roomTyping.filter(id => id !== userId) };
        }
        return prev;
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Convert API message to local message format
  const convertApiMessageToMessage = (apiMessage: ApiMessage): Message => ({
      id: apiMessage._id,
      text: apiMessage.content,
      timestamp: new Date(apiMessage.createdAt),
      senderId: apiMessage.senderId === CURRENT_USER_ID ? 'current' : apiMessage.senderId,
      isRead: apiMessage.isRead,
      roomId: undefined
  });

  // Convert API conversation to local chat format
  const convertApiConversationToChat = (apiConv: ApiConversation): Chat => {
    const otherUserId = apiConv.participants.find(id => id !== CURRENT_USER_ID) || '';
    
    return {
      id: apiConv._id,
      user: {
        id: otherUserId,
        username: `user_${otherUserId.slice(-4)}`, // Placeholder - you'll need user data
        avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`,
        isOnline: onlineUsers.has(otherUserId),
        lastSeen: new Date(),
      },
      lastMessage: apiConv.lastMessage ? convertApiMessageToMessage({
        _id: apiConv.lastMessage._id,
        content: apiConv.lastMessage.content,
        senderId: apiConv.lastMessage.senderId,
        receiverId: '',
        roomId: apiConv._id,
        isRead: apiConv.lastMessage.isRead,
        isDelivered: apiConv.lastMessage.isDelivered,
        createdAt: apiConv.lastMessage.createdAt,
        updatedAt: apiConv.lastMessage.createdAt,
      }) : {
        id: 'default',
        text: 'No messages yet',
        timestamp: new Date(apiConv.createdAt),
        senderId: 'system',
        isRead: true,
      },
      unreadCount: 0, // You'll need to calculate this from unread messages
    };
  };

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const apiConversations = await chatApi.getConversations();
      const chats = apiConversations.map(convertApiConversationToChat);
      setConversations(chats);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [onlineUsers]);

  // Load messages for a specific room
  const loadMessages = useCallback(async (roomId: string) => {
    try {
      if (messages[roomId]) return; // Already loaded
      
      const apiMessages = await chatApi.getMessages(roomId);
      const roomMessages = apiMessages.map(convertApiMessageToMessage);
      
      setMessages(prev => ({
        ...prev,
        [roomId]: roomMessages
      }));

      // Join the room for real-time updates
      socketService.joinRoom(roomId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [messages]);

  // Send a message
  const sendMessage = useCallback(async (roomId: string, content: string, receiverId: string) => {
    try {
      const messageData = {
        senderId: CURRENT_USER_ID,
        receiverId,
        roomId,
        content: content.trim(),
      };

      // Send via socket for real-time delivery
      socketService.sendMessage(messageData);
      
      // Also send via API for persistence
      await chatApi.sendMessage(messageData);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((roomId: string, isTyping: boolean) => {
    socketService.sendTyping(roomId, isTyping);
    
    if (isTyping) {
      // Clear existing timeout
      if (typingTimeoutRef.current[roomId]) {
        clearTimeout(typingTimeoutRef.current[roomId]);
      }
      
      // Set timeout to stop typing after 3 seconds
      typingTimeoutRef.current[roomId] = setTimeout(() => {
        socketService.sendTyping(roomId, false);
      }, 3000);
    }
  }, []);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (roomId: string) => {
    try {
      await chatApi.markRoomMessagesRead(roomId);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, []);

  return {
    conversations,
    messages,
    loading,
    onlineUsers,
    typingUsers,
    loadConversations,
    loadMessages,
    sendMessage,
    sendTyping,
    markMessagesAsRead,
  };
};  chatApi.ts import axios from 'axios';

const BASE_URL = 'http://172.50.5.116:3001';
const BASE_URL1 = 'http://172.50.5.102:3011';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
const userApi = axios.create({
  baseURL: BASE_URL1,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add auth token to requests (you'll need to implement auth token management)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("instagram_user")
  if (token) {
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUyN2UxMDgwM2Y3MmQwODk0ZWEyY2EiLCJlbWFpbCI6InN3ZWV0ZGlzaEB5b3BtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiZGV2aWNlSWQiOiJ0ZXN0LWRldmljZTEiLCJpcEFkZHJlc3MiOiIxOTIuMTY4LjEuMSIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiIsImlhdCI6MTc1MDI0MjQ4OSwiZXhwIjoxNzUwMzI4ODg5LCJzdWIiOiI2ODUyN2UxMDgwM2Y3MmQwODk0ZWEyY2EifQ.9rjqbJ_Lpv4ijNbjSyCX6VMXfoQWSPqgtk54_5f8I_s`;

  }
  return config;
});
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export interface ApiConversation {
  _id: string;
  participants: string[];
  lastMessage?: {
    _id: string;
    content: string;
    senderId: string;
    createdAt: string;
    isRead: boolean;
    isDelivered: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  content: string;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}

export const chatApi = {
  // Create or fetch conversation
  createConversation: async (user2: string) => {
    const response = await api.post('/chat/conversation', { user2 });
    return response.data;
  },

  // Send message
  sendMessage: async (messageData: {
    senderId: string;
    receiverId: string;
    roomId: string;
    content: string;
  }) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },

  // Mark messages as delivered
  markMessagesDelivered: async (messageIds: string[]) => {
    const response = await api.patch('/chat/messages/delivered', { messageIds });
    return response.data;
  },

  // Mark single message as delivered
  markMessageDelivered: async (messageId: string) => {
    const response = await api.patch(`/chat/message/${messageId}/delivered`);
    return response.data;
  },

  // Mark message as read
  markMessageRead: async (messageId: string) => {
    const response = await api.patch(`/chat/message/read/${messageId}`, { messageId });
    return response.data;
  },

  // Mark all messages in room as read
  markRoomMessagesRead: async (roomId: string) => {
    const response = await api.patch(`/chat/message/read/room/${roomId}`);
    return response.data;
  },

  // Get all conversations
  getConversations: async (): Promise<ApiConversation[]> => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  // Get messages from room
  getMessages: async (roomId: string): Promise<ApiMessage[]> => {
    const response = await api.get(`/chat/messages/${roomId}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (userId: string) => {
    const response = await api.get(`/chat/message/unread/${userId}`);
    return response.data;
  },

  // Get offline messages
  getOfflineMessages: async (userId: string) => {
    const response = await api.get(`/chat/offline/${userId}`);
    return response.data;
  },

  // Edit message
  editMessage: async (messageId: string, newContent: string) => {
    const response = await api.put(`/chat/message/${messageId}`, {
      messageId,
      newContent,
    });
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/chat/message/${messageId}`);
    return response.data;
  },
  

};  socketService.ts  
import { io, Socket } from 'socket.io-client';
import { ApiMessage } from './chatApi';

class SocketService {
  onUserOnline(arg0: (userId: string) => void) {
      throw new Error('Method not implemented.');
  }
  onUserOffline(arg0: (userId: string) => void) {
      throw new Error('Method not implemented.');
  }
  private socket: Socket | null = null;
  private currentUserId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      return;
    }

    this.currentUserId = userId;
    this.socket = io('http://172.50.5.116/chat', {
      auth: {
        userId,
        token: localStorage.getItem('authToken'),
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      if (userId) {
        this.socket?.emit('user:online', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentUserId = null;
    }
  }

  // Join a chat room
  joinRoom(roomId: string) {
    this.socket?.emit('join_room', roomId);
  }

  // Leave a chat room
  leaveRoom(roomId: string) {
    this.socket?.emit('room:leave', roomId);
  }

  // Send message via socket
  sendMessage(messageData: {
    roomId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) {
    this.socket?.emit('send_message', messageData);
  }

  // Listen for new messages
  onNewMessage(callback: (message: ApiMessage) => void) {
    this.socket?.on('message:new', callback);
  }

  // Listen for message status updates
  onMessageStatusUpdate(callback: (data: { messageId: string; status: 'delivered' | 'read' }) => void) {
    this.socket?.on('message:status', callback);
  }

  // Listen for user online/offline status
  onUserStatusChange(callback: (data: { userId: string; isOnline: boolean; lastSeen?: Date }) => void) {
    this.socket?.on('user:status', callback);
  }

  // Listen for typing indicators
  onTyping(callback: (data: { userId: string; roomId: string; isTyping: boolean }) => void) {
    this.socket?.on('user:typing', callback);
  }

  // Send typing indicator
  sendTyping(roomId: string, isTyping: boolean) {
    this.socket?.emit('user:typing', { roomId, isTyping });
  }

  // Mark message as delivered
  markDelivered(messageId: string) {
    this.socket?.emit('message_delivered', messageId);
  }

  // Mark message as read
  markRead(messageId: string) {
    this.socket?.emit('message_read', messageId);
  }

  // Remove event listeners
  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();  i am frontend developer and i have allocated the chat section in social media project. i integrated  chat service api endpoints and all frontend work in my code. now i want to test another api whose swagger ui i am giving you : GET
/users/me/following

get current user following
Parameters
Name	Description
query
string
(query)
	

Search query string
page
number
(query)
	

Page number for pagination  . Code	Description	Links
200	

Current user following retrieved.
	No links  . now i want to do frontend work for this api and want to intgrate all necessary work for this api nothing else, do nothing else just do what i ask for