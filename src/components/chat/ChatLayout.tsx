// src/components/chat/ChatLayout.tsx
import { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { Chat } from './types';
import { useChat } from '../../hooks/useChat';
import styles from './ChatLayout.module.css';
import { chatApi } from '../../services/chatApi';

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
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChatSelect = async (chat: Chat) => {
    let selectedChatId = chat.id;
    if (chat.id.startsWith('temp_')) {
      try {
        const response = await chatApi.createConversation(chat.user.id);
        selectedChatId = response._id;
        await loadConversations();
      } catch (error) {
        console.error('Failed to create conversation:', error);
        return;
      }
    }
    const newSelectedChat = conversations.find(c => c.id === selectedChatId) || {
      ...chat,
      id: selectedChatId,
    };
    setSelectedChat(newSelectedChat);
    loadMessages(selectedChatId);
    markMessagesAsRead(selectedChatId);
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
      <div className={`${styles.chatList} ${
        isMobile && selectedChat ? styles.chatListHidden : ''
      }`}>
        <ChatList 
          chats={conversations}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
        />
      </div>
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

export default ChatLayout;