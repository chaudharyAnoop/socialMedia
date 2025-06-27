import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Phone, Video, Info, Send } from "lucide-react";
import { Chat, Message } from "../../interfaces/types";
import MessageBubble from "./MessageBubble";
import styles from "./ChatWindow.module.css";
import { useAppSelector } from "../../redux/hooks";

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  typingUsers: string[];
  onUnreadInView: () => void;
}

const ChatWindow = ({
  chat,
  messages,
  onBack,
  onSendMessage,
  onTyping,
  onUnreadInView,
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { typingUsers: roomTypingUsers } = useAppSelector(
    (state) => state.chat
  );

  const lastUnreadIndex = messages
    .map((msg, idx) =>
      (msg.status === "sent" || msg.status === "delivered") &&
      msg.senderId !== "current"
        ? idx
        : null
    )
    .filter((idx) => idx !== null)
    .pop();

  const lastUnreadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastUnreadRef.current && typeof onUnreadInView === "function") {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onUnreadInView();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(lastUnreadRef.current);

      return () => observer.disconnect();
    }
  }, [lastUnreadRef, onUnreadInView, messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, roomTypingUsers]);

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
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={onBack}
            className={styles.backButton}
            aria-label="Back to chat list"
          >
            <ArrowLeft size={20} />
          </button>
          <div className={styles.avatarContainer}>
            <img
              src={chat.user.avatar || "https://picsum.photos/800/600?random=4"}
              alt={`${chat.user.username}'s avatar`}
              className={styles.avatar}
            />
            {chat.user.isOnline && (
              <div className={styles.onlineIndicator}></div>
            )}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.username}>{chat.user.username}</h2>
            <p className={styles.status}>
              {chat.user.isOnline
                ? "Active now"
                : `Active ${Math.floor(
                    (Date.now() - new Date(chat.user.lastSeen).getTime()) /
                      (1000 * 60 * 60)
                  )}h ago`}
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.actionButton} title="Call">
            <Phone size={20} />
          </button>
          <button className={styles.actionButton} title="Video Call">
            <Video size={20} />
          </button>
          <button className={styles.actionButton} title="User Info">
            <Info size={20} />
          </button>
        </div>
      </div>
      <div className={styles.messagesContainer} ref={messagesEndRef}>
        {messages.map((message, idx) => (
          <div
            key={message.id}
            ref={idx === lastUnreadIndex ? lastUnreadRef : undefined}
          >
            <MessageBubble
              message={message}
              isOwn={message.senderId === "current"}
            />
          </div>
        ))}
        {roomTypingUsers[chat.id]?.length > 0 && (
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
      </div>
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
              aria-label="Type a message"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`${styles.sendButton} ${
              newMessage.trim()
                ? styles.sendButtonActive
                : styles.sendButtonInactive
            }`}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
