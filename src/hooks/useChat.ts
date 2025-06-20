import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services/socketService';
import { chatApi, ApiMessage, ApiConversation, FollowingUser, FollowingResponse } from '../services/chatApi';
import { Chat, Message, User } from '../components/chat/types';

const CURRENT_USER_ID = 'current_user_id';

export const useChat = () => {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({});
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<{ [roomId: string]: string[] }>({});
  const [following, setFollowing] = useState<User[]>([]);
  const typingTimeoutRef = useRef<{ [roomId: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    socketService.connect(CURRENT_USER_ID);
    socketService.onNewMessage((apiMessage) => {
      const message = convertApiMessageToMessage(apiMessage);
      setMessages(prev => ({
        ...prev,
        [apiMessage.roomId]: [...(prev[apiMessage.roomId] || []), message]
      }));
      setConversations(prev => 
        prev.map(conv => 
          conv.id === apiMessage.roomId 
            ? { ...conv, lastMessage: message, unreadCount: apiMessage.senderId !== CURRENT_USER_ID ? conv.unreadCount + 1 : conv.unreadCount }
            : conv
        )
      );
    });
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

  const convertApiMessageToMessage = (apiMessage: ApiMessage): Message => ({
    id: apiMessage._id,
    text: apiMessage.content,
    timestamp: new Date(apiMessage.createdAt),
    senderId: apiMessage.senderId === CURRENT_USER_ID ? 'current' : apiMessage.senderId,
    isRead: apiMessage.isRead,
    roomId: undefined
  });

  const convertApiConversationToChat = (apiConv: ApiConversation): Chat => {
    const otherUserId = apiConv.participants.find(id => id !== CURRENT_USER_ID) || '';
    return {
      id: apiConv._id,
      user: {
        id: otherUserId,
        username: `user_${otherUserId.slice(-4)}`,
        avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`,
        isOnline: onlineUsers.has(otherUserId),
        lastSeen: new Date(apiConv.updatedAt),
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
      unreadCount: 0,
    };
  };

  const convertApiFollowingToUser = (apiUser: FollowingUser): User => ({
    id: apiUser.id,
    username: apiUser.username,
    avatar: apiUser.avatar,
    isOnline: apiUser.isOnline,
    lastSeen: new Date(apiUser.lastSeen),
  });

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

  const loadFollowing = useCallback(async (query: string = '', page: number = 1) => {
    try {
      setLoading(true);
      const response: FollowingResponse = await chatApi.getFollowing(query, page);
      const users = response.users.map(convertApiFollowingToUser);
      setFollowing(users);
      return response;
    } catch (error) {
      console.error('Failed to load following:', error);
      return { users: [], total: 0, page: 1, totalPages: 1 };
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (roomId: string) => {
    try {
      if (messages[roomId]) return;
      const apiMessages = await chatApi.getMessages(roomId);
      const roomMessages = apiMessages.map(convertApiMessageToMessage);
      setMessages(prev => ({
        ...prev,
        [roomId]: roomMessages
      }));
      socketService.joinRoom(roomId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [messages]);

  const sendMessage = useCallback(async (roomId: string, content: string, receiverId: string) => {
    try {
      const messageData = {
        senderId: CURRENT_USER_ID,
        receiverId,
        roomId,
        content: content.trim(),
      };
      socketService.sendMessage(messageData);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, []);

  const sendTyping = useCallback((roomId: string, isTyping: boolean) => {
    socketService.sendTyping(roomId, isTyping);
    if (isTyping) {
      if (typingTimeoutRef.current[roomId]) {
        clearTimeout(typingTimeoutRef.current[roomId]);
      }
      typingTimeoutRef.current[roomId] = setTimeout(() => {
        socketService.sendTyping(roomId, false);
      }, 3000);
    }
  }, []);

  const markMessagesAsRead = useCallback(async (roomId: string) => {
    try {
      await chatApi.markRoomMessagesRead(roomId);
      setMessages(prev => {
        const newMessages = { ...prev };
        if (newMessages[roomId]) {
          newMessages[roomId] = newMessages[roomId].map(msg => ({
            ...msg,
            isRead: true,
          }));
        }
        return newMessages;
      });
      setConversations(prev =>
        prev.map(conv =>
          conv.id === roomId ? { ...conv, unreadCount: 0 } : conv
        )
      );
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
    following,
    loadConversations,
    loadFollowing,
    loadMessages,
    sendMessage,
    sendTyping,
    markMessagesAsRead,
  };
};