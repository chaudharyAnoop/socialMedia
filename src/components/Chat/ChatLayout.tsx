import { useState, useEffect, useCallback } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import styles from "./ChatLayout.module.css";
import { Chat } from "../../interfaces/types";
import { chatApi } from "../../services/chatApi";
import { Plus } from "lucide-react";

import { socketService } from "../../services/socketService";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../hooks/useChat";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  loadConversations,
  loadMessages,
  markMessagesAsRead,
  sendMessage,
  setSelectedChat,
} from "../../redux/chatSlice/chatSlice";
const ChatLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useAppDispatch();
  const { conversations, messages, loading, error } = useAppSelector(
    (state) => state.chat
  );
  const [selectedChat, setSelectedChatLocal] = useState<Chat | null>(null);
  const { user } = useAuth();
  useChat();
  useEffect(() => {
    if (user?._id) {
      dispatch(loadConversations(user._id));
    }
  }, [dispatch]);

  useEffect(() => {
    const savedChatId = localStorage.getItem("selectedChatId");
    if (savedChatId && conversations.length > 0) {
      const chat = conversations.find((c) => c.id === savedChatId);
      if (chat) {
        setSelectedChatLocal(chat);
        dispatch(setSelectedChat(chat));
      }
    }
  }, [conversations, dispatch]);
  const handleUnreadInView = useCallback(() => {
    if (selectedChat) {
      const chatMessages = messages[selectedChat.id] || [];
      const hasUnreadFromOthers = chatMessages.some(
        (msg) =>
          (msg.status === "sent" || msg.status === "delivered") &&
          msg.senderId !== "current" &&
          msg.text
      );
      if (hasUnreadFromOthers) {
        dispatch(
          markMessagesAsRead({ roomId: selectedChat.id, id: user?._id })
        );
      }
    }
  }, [dispatch, messages]);
  useEffect(() => {
    const savedChatId = localStorage.getItem("selectedChatId");
    if (user?._id && savedChatId) {
      dispatch(loadMessages({ roomId: savedChatId, id: user._id }));
    }
  }, []);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatSelect = async (chat: Chat) => {
    let selectedChatId = chat.id;
    if (chat.id.startsWith("temp_")) {
      try {
        const response = await chatApi.createConversation(chat.user.id);
        selectedChatId = response._id;
        await dispatch(loadConversations());
      } catch (error) {
        console.error("Failed to create conversation:", error);
        return;
      }
    }
    const newSelectedChat =
      conversations.find((c) => c.id === selectedChatId) || chat;
    setSelectedChatLocal(newSelectedChat);
    dispatch(setSelectedChat(newSelectedChat));
    localStorage.setItem("selectedChatId", selectedChatId);
    if (user?._id)
      dispatch(loadMessages({ roomId: selectedChatId, id: user._id }));
  };
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateIcon}>⚠️</div>
            <h2 className={styles.emptyStateTitle}>Error</h2>
            <p className={styles.emptyStateDescription}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => dispatch(loadConversations())}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
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
      <div
        className={`${styles.chatList} ${
          isMobile && selectedChat ? styles.chatListHidden : ""
        }`}
      >
        <ChatList
          chats={conversations}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
        />
      </div>
      <div
        className={`${styles.chatWindow} ${
          isMobile && !selectedChat ? styles.chatWindowHidden : ""
        }`}
      >
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messages[selectedChat.id] || []}
            onBack={() => {
              setSelectedChatLocal(null);
              dispatch(setSelectedChat(null));
              localStorage.removeItem("selectedChatId");
            }}
            onSendMessage={(content) =>
              dispatch(
                sendMessage({
                  roomId: selectedChat.id,
                  content,
                  receiverId: selectedChat.user.id,
                  id: user?._id ?? "",
                })
              )
            }
            onTyping={(isTyping) =>
              socketService.sendTyping(selectedChat.id, isTyping)
            }
            typingUsers={[]}
            onUnreadInView={handleUnreadInView}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateContent}>
              <div className={styles.emptyStateIcon}>💬</div>
              <h2 className={styles.emptyStateTitle}>Your Messages</h2>
              <p className={styles.emptyStateDescription}>
                Send messages to a friend or start a new conversation.
              </p>
              <button className={styles.startChatButton}>
                <Plus size={20} /> Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
