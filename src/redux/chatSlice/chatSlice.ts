import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  chatApi,
  ApiConversation,
  ApiMessage,
  FollowingResponse,
} from "../../services/chatApi";
import { socketService } from "../../services/socketService";
import { Chat, FollowingUser, Message, User } from "../../interfaces/types";

interface ChatState {
  conversations: Chat[];
  messages: { [roomId: string]: Message[] };
  onlineUsers: string[];
  typingUsers: { [roomId: string]: string[] };
  following: User[];
  loading: boolean;
  error: string | null;
  selectedChat: Chat | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  onlineUsers: [],
  typingUsers: {},
  following: [],
  loading: false,
  error: null,
  selectedChat: null,
};

export const loadConversations = createAsyncThunk(
  "chat/loadConversations",
  async (id: string | undefined, { getState }) => {
    const { chat } = getState() as { chat: ChatState };
    const apiConversations = await chatApi.getConversations();
    const chats = await Promise.all(
      apiConversations.map((apiConv) =>
        convertApiConversationToChat(apiConv, chat.onlineUsers, id)
      )
    );
    return chats;
  }
);

export const loadMessages = createAsyncThunk(
  "chat/loadMessages",
  async ({ roomId, id }: { roomId: string; id: string | undefined }) => {
    socketService.joinRoom(roomId);
    const apiMessages = await chatApi.getMessages(roomId);
    return {
      roomId,
      messages: apiMessages.map((val) => convertApiMessageToMessage(val, id)),
    };
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      roomId,
      content,
      receiverId,
      id,
    }: { roomId: string; content: string; receiverId: string; id: string },
    { getState }
  ) => {
    const { chat } = getState() as { chat: ChatState };
    const messageData = {
      senderId: id,
      receiverId,
      roomId,
      content: content.trim(),
    };
    socketService.sendMessage(messageData);
  }
);

export const loadFollowing = createAsyncThunk(
  "chat/loadFollowing",
  async ({ query, page }: { query: string; page: number }) => {
    const response: FollowingResponse = await chatApi.getFollowing(query, page);
    return response.users.map(convertApiFollowingToUser);
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (
    { roomId, id }: { roomId: string; id: string | undefined },
    { getState }
  ) => {
    await chatApi.markRoomMessagesRead(roomId);
    const state = getState() as { chat: ChatState };
    const messages = state.chat.messages[roomId] || [];
    messages.forEach((msg) => {
      if (
        (msg.status === "sent" || msg.status === "delivered") &&
        msg.senderId !== id
      ) {
        socketService.markRead(msg.id);
      }
    });
    return { roomId, id };
  }
);

const convertApiMessageToMessage = (
  apiMessage: ApiMessage,
  id: string | undefined
): Message => {
  return {
    id: apiMessage._id,
    text: apiMessage.content,
    timestamp: new Date(apiMessage.createdAt).toISOString(),
    senderId: apiMessage.sender === id ? "current" : apiMessage.sender,
    status: apiMessage.status || "sent",
    roomId: apiMessage.roomId,
  };
};

const convertApiConversationToChat = async (
  apiConv: ApiConversation,
  onlineUsers: string[],
  id: string | undefined
): Promise<Chat> => {
  const otherUserId = apiConv.participants.find((ids) => ids !== id) || "";
  const userData = await chatApi.getUser(otherUserId);
  return {
    id: apiConv._id,
    user: {
      id: userData._id,
      username: userData.username || `user_${otherUserId.slice(-4)}`,
      avatar: userData.avatar || "https://picsum.photos/800/600",
      isOnline: onlineUsers.find((val) => val == otherUserId) ? true : false,
      lastSeen: new Date(userData.lastSeen || Date.now()).toISOString(),
    },
    lastMessage: apiConv.lastMessage
      ? convertApiMessageToMessage(
          {
            _id: apiConv.lastMessage._id,
            content: apiConv.lastMessage.content,
            sender: apiConv.lastMessage.senderId,
            receiver: "",
            roomId: apiConv._id,
            createdAt: apiConv.lastMessage.createdAt,
            updatedAt: apiConv.lastMessage.createdAt,
          },
          id
        )
      : {
          id: "default",
          text: "No messages yet",
          timestamp: new Date(apiConv.createdAt).toISOString(),
          senderId: "system",
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
  lastSeen: new Date(apiUser.lastSeen).toISOString(),
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload;
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (message.roomId) {
        const roomMessages = state.messages[message.roomId] ?? [];
        state.messages[message.roomId] = [...roomMessages, message];
      }
      state.conversations = state.conversations.map((conv) =>
        conv.id === message.roomId
          ? {
              ...conv,
              lastMessage: message,
              unreadCount:
                message.senderId !== "current"
                  ? conv.unreadCount + 1
                  : conv.unreadCount,
            }
          : conv
      );
    },
    sendMessageReal: (state, action) => {
      const mes = action.payload.message;
      const message = convertApiMessageToMessage(mes, action.payload.id);
      if (message.roomId) {
        const roomMessages = state.messages[message.roomId] || [];
        state.messages[message.roomId] = [...roomMessages, message];
      }
    },
    updateMessageDelivered: (
      state,
      action: PayloadAction<{ messageId: string }>
    ) => {
      Object.keys(state.messages).forEach((roomId) => {
        state.messages[roomId] = state.messages[roomId].map((msg) =>
          msg.id === action.payload.messageId
            ? { ...msg, status: "delivered" }
            : msg
        );
      });
    },
    updateMessageEdited: (
      state,
      action: PayloadAction<{ messageId: string; newContent: string }>
    ) => {
      Object.keys(state.messages).forEach((roomId) => {
        state.messages[roomId] = state.messages[roomId].map((msg) =>
          msg.id === action.payload.messageId
            ? { ...msg, text: action.payload.newContent }
            : msg
        );
      });
    },
    updateMessageDeleted: (
      state,
      action: PayloadAction<{ messageId: string }>
    ) => {
      Object.keys(state.messages).forEach((roomId) => {
        state.messages[roomId] = state.messages[roomId].map((msg) =>
          msg.id !== action.payload.messageId ? msg : { ...msg, text: "" }
        );
      });
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: string }>
    ) => {
      console.log(action.payload);
      Object.keys(state.messages).forEach((roomId) => {
        state.messages[roomId] = state.messages[roomId].map((msg) =>
          msg.id === action.payload.messageId ? { ...msg, status: "read" } : msg
        );
      });
    },

    updateUserStatus: (
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean }>
    ) => {
      const { userId, isOnline } = action.payload;
      if (isOnline) {
        state.onlineUsers.push(userId);
      } else {
        state.onlineUsers = state.onlineUsers.filter((val) => val != userId);
      }
      state.conversations = state.conversations.map((conv) =>
        conv.user.id === userId
          ? { ...conv, user: { ...conv.user, isOnline } }
          : conv
      );
    },
    updateTyping: (
      state,
      action: PayloadAction<{
        userId: string;
        roomId: string;
        isTyping: boolean;
      }>
    ) => {
      const { userId, roomId, isTyping } = action.payload;
      const roomTyping = state.typingUsers[roomId] || [];
      if (isTyping && !roomTyping.includes(userId)) {
        state.typingUsers[roomId] = [...roomTyping, userId];
      } else if (!isTyping) {
        state.typingUsers[roomId] = roomTyping.filter((id) => id !== userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(loadConversations.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load conversations. Please try again.";
      })
      .addCase(loadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.roomId] =
          action.payload.messages.reverse();
      })
      .addCase(loadMessages.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load messages. Please try again.";
      })
      .addCase(loadFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(loadFollowing.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load following users. Please try again.";
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { roomId, id } = action.payload;
        if (state.messages[roomId]) {
          state.messages[roomId] = state.messages[roomId].map((msg) => ({
            ...msg,
            status: "read",
          }));
        }
        state.conversations = state.conversations.map((val) =>
          val.id == roomId ? { ...val, unreadCount: 0 } : val
        );
      });
  },
});

export const {
  setSelectedChat,
  receiveMessage,
  updateMessageDelivered,
  updateMessageEdited,
  updateMessageDeleted,
  updateMessageStatus,
  updateUserStatus,
  updateTyping,
  sendMessageReal,
} = chatSlice.actions;

export default chatSlice.reducer;
