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
    if (messagesEndRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, typingUsers]);
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
              src={"https://picsum.photos/800/600?random=4"}
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

        {/* <div className={styles.headerRight}>
          <button className={styles.actionButton}>
            <Phone size={20} />
          </button>
          <button className={styles.actionButton}>
            <Video size={20} />
          </button>
          <button className={styles.actionButton}>
            <Info size={20} />
          </button>
        </div> */}
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer} ref={messagesEndRef}>
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
        
        <div  />
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
            
            {/* <div className={styles.inputActions}>
              <button className={styles.inputActionButton}>
                <Smile size={16} />
              </button>
              <button className={styles.inputActionButton}>
                <Image size={16} />
              </button>
            </div> */}
          </div>
          
          <button
            onClick={handleSendMessage }
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

export default ChatWindow;