import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { socketService } from "../services/socketService";
import {
  chatApi,
  ApiMessage,
  ApiConversation,
  FollowingUser,
  FollowingResponse,
} from "../services/chatApi";
import { Chat, Message, User } from "../components/Chat/types";

export const useChat = () => {
  const { user } = useAuth();
  const CURRENT_USER_ID = user?.id || "guest";
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<{
    [roomId: string]: string[];
  }>({});
  const [following, setFollowing] = useState<User[]>([]);
  const typingTimeoutRef = useRef<{ [roomId: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    socketService.connect(CURRENT_USER_ID);

    socketService.onMessageSent((message) => {
      console.log("Message sent confirmation:", message);
    });

    socketService.onNewMessage((message) => {
      const convertedMessage = convertApiMessageToMessage(message);
      setMessages((prev) => {
        const roomMessages = prev[message.roomId] ?? [];
        // Prevent duplication by checking if message ID already exists
        if (roomMessages.some((msg) => msg.id === convertedMessage.id)) {
          return prev;
        }
        return {
          ...prev,
          [message.roomId]: [...roomMessages, convertedMessage],
        };
      });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.roomId
            ? {
                ...conv,
                lastMessage: convertedMessage,
                unreadCount:
                  message.sender !== CURRENT_USER_ID
                    ? conv.unreadCount + 1
                    : conv.unreadCount,
              }
            : conv
        )
      );
    });

    socketService.onMessageDelivered(({ messageId }) => {
      setMessages((prev) => {
        const newMessages = { ...prev };
        Object.keys(newMessages).forEach((roomId) => {
          newMessages[roomId] = newMessages[roomId].map((msg) =>
            msg.id === messageId ? { ...msg, isDelivered: true } : msg
          );
        });
        return newMessages;
      });
    });

    socketService.onMessageEdited(({ messageId, newContent }) => {
      setMessages((prev) => {
        const newMessages = { ...prev };

        Object.keys(newMessages).forEach((roomId) => {
          newMessages[roomId] = newMessages[roomId].map((msg) =>
            msg.id === messageId ? { ...msg, text: newContent } : msg
          );
        });

        return newMessages;
      });
    });

    socketService.onMessageDeleted(({ messageId }) => {
      setMessages((prev) => {
        const newMessages = { ...prev };
        Object.keys(newMessages).forEach((roomId) => {
          newMessages[roomId] = newMessages[roomId].filter(
            (msg) => msg.id !== messageId
          );
        });
        return newMessages;
      });
    });

    socketService.onMessageStatusUpdate(({ messageId, status }) => {
      setMessages((prev) => {
        const newMessages = { ...prev };
        Object.keys(newMessages).forEach((roomId) => {
          newMessages[roomId] = newMessages[roomId].map((msg) =>
            msg.id === messageId ? { ...msg, isRead: status === "read" } : msg
          );
        });
        return newMessages;
      });
    });
    // remove if not provided by backend
    socketService.onUserStatusChange(({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });
    // remove if not provided by backend
    socketService.onTyping(({ userId, roomId, isTyping }) => {
      setTypingUsers((prev) => {
        const roomTyping = prev[roomId] || [];
        if (isTyping && !roomTyping.includes(userId)) {
          return { ...prev, [roomId]: [...roomTyping, userId] };
        } else if (!isTyping) {
          return {
            ...prev,
            [roomId]: roomTyping.filter((id) => id !== userId),
          };
        }
        return prev;
      });
    });

    return () => socketService.disconnect();
  }, [socketService]);

  const convertApiMessageToMessage = (apiMessage: ApiMessage): Message => ({
    id: apiMessage._id,
    text: apiMessage.content,
    timestamp: new Date(apiMessage.createdAt),
    senderId:
      apiMessage.sender === CURRENT_USER_ID ? "current" : apiMessage.sender,
    isRead: apiMessage.isRead,
    roomId: apiMessage.roomId,
  });

  const convertApiConversationToChat = async (
    apiConv: ApiConversation
  ): Promise<Chat> => {
    const otherUserId =
      apiConv.participants.find((id) => id !== CURRENT_USER_ID) || "";
    const userData = await chatApi.getUser(otherUserId);
    return {
      id: apiConv._id,
      roomId: apiConv._id,
      user: {
        id: userData._id,
        username: userData.username || `user_${otherUserId.slice(-4)}`,
        avatar: userData.avatar || "https://picsum.photos/800/600",
        isOnline: onlineUsers.has(otherUserId),
        lastSeen: new Date(userData.lastSeen || Date.now()),
      },
      lastMessage: apiConv.lastMessage
        ? convertApiMessageToMessage({
            _id: apiConv.lastMessage._id,
            content: apiConv.lastMessage.content,
            sender: apiConv.lastMessage.senderId,
            receiver: "",
            roomId: apiConv._id,
            isRead: apiConv.lastMessage.isRead,
            isDelivered: apiConv.lastMessage.isDelivered,
            createdAt: apiConv.lastMessage.createdAt,
            updatedAt: apiConv.lastMessage.createdAt,
            status: "read",
          })
        : {
            id: "default",
            text: "No messages yet",
            timestamp: new Date(apiConv.createdAt),
            senderId: "system",
            isRead: true,
            roomId: apiConv._id,
          },
      unreadCount: 0,
    };
  };

  const convertApiFollowingToUser = (apiUser: FollowingUser): User => ({
    id: apiUser._id,
    username: apiUser.username,
    avatar: apiUser.avatar,
    isOnline: apiUser.isOnline,
    lastSeen: new Date(apiUser.lastSeen),
  });

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiConversations = await chatApi.getConversations();
      const chats = await Promise.all(
        apiConversations.map(convertApiConversationToChat)
      );
      setConversations(chats);
    } catch (error) {
      setError("Failed to load conversations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [onlineUsers, CURRENT_USER_ID]);

  const loadFollowing = useCallback(
    async (query: string = "", page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response: FollowingResponse = await chatApi.getFollowing(
          query,
          page
        );

        const users = response.users.map(convertApiFollowingToUser);
        setFollowing(users);
        return response;
      } catch (error) {
        setError("Failed to load following users. Please try again.");
        return { users: [], total: 0, page: 1, totalPages: 1 };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMessages = useCallback(async (roomId: string) => {
    try {
      if (messages[roomId]) return;
      setLoading(true);
      setError(null);
      socketService.joinRoom(roomId);
      const apiMessages = await chatApi.getMessages(roomId);

      const roomMessages = apiMessages.map(convertApiMessageToMessage);

      setMessages((prev) => ({
        ...prev,
        [roomId]: roomMessages.reverse(),
      }));
      socketService.joinRoom(roomId);
    } catch (error) {
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (roomId: string, content: string, receiverId: string) => {
      try {
        setError(null);
        const messageData = {
          senderId: CURRENT_USER_ID,
          receiverId,
          roomId,
          content: content.trim(),
        };
        socketService.sendMessage(messageData);
        const message = await chatApi.sendMessage(messageData);

        const roomMessage = convertApiMessageToMessage(message);
        setMessages((prev) => ({
          ...prev,
          [roomId]: [...prev[roomId], roomMessage],
        }));
      } catch (error) {
        setError("Failed to send message. Please try again.");
      }
    },
    [CURRENT_USER_ID,messages]
  );

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
      setError(null);
      await chatApi.markRoomMessagesRead(roomId);
    } catch (error) {
      setError("Failed to mark messages as read.");
    }
  }, []);

  return {
    conversations,
    messages,
    loading,
    error,
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
