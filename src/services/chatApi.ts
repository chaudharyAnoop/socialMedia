// src/services/chatApi.ts
import { ApiConversation, ApiMessage, FollowingUser, FollowingResponse } from './chatApi';

const CURRENT_USER_ID = 'current_user_id';

// Mock data for followed users
const mockFollowingUsers: FollowingUser[] = [
  {
    id: 'user1',
    username: 'john_doe',
    avatar: 'https://images.unsplash.com/photo-1500648767791-7c7c1c2b3b4a?w=150&h=150&fit=crop',
    isOnline: true,
    lastSeen: '2025-06-19T03:50:00Z',
  },
  {
    id: 'user2',
    username: 'jane_smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    isOnline: false,
    lastSeen: '2025-06-18T12:00:00Z',
  },
  {
    id: 'user3',
    username: 'alice_wonder',
    avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3f6b1f7?w=150&h=150&fit=crop',
    isOnline: true,
    lastSeen: '2025-06-19T03:30:00Z',
  },
  {
    id: 'user4',
    username: 'bob_builder',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
    isOnline: false,
    lastSeen: '2025-06-17T10:00:00Z',
  },
];

// Mock data for conversations
const mockConversations: ApiConversation[] = [
  {
    _id: 'conv1',
    participants: [CURRENT_USER_ID, 'user1'],
    lastMessage: {
      _id: 'msg1',
      content: 'Hey, how’s it going?',
      senderId: 'user1',
      createdAt: '2025-06-19T03:45:00Z',
      isRead: false,
      isDelivered: true,
    },
    createdAt: '2025-06-18T10:00:00Z',
    updatedAt: '2025-06-19T03:45:00Z',
  },
  {
    _id: 'conv2',
    participants: [CURRENT_USER_ID, 'user2'],
    lastMessage: {
      _id: 'msg2',
      content: 'Let’s catch up soon!',
      senderId: CURRENT_USER_ID,
      createdAt: '2025-06-18T15:30:00Z',
      isRead: true,
      isDelivered: true,
    },
    createdAt: '2025-06-17T09:00:00Z',
    updatedAt: '2025-06-18T15:30:00Z',
  },
];

// Mock data for messages
const mockMessages: { [roomId: string]: ApiMessage[] } = {
  conv1: [
    {
      _id: 'msg1',
      senderId: 'user1',
      receiverId: CURRENT_USER_ID,
      roomId: 'conv1',
      content: 'Hey, how’s it going?',
      isRead: false,
      isDelivered: true,
      createdAt: '2025-06-19T03:45:00Z',
      updatedAt: '2025-06-19T03:45:00Z',
    },
    {
      _id: 'msg3',
      senderId: CURRENT_USER_ID,
      receiverId: 'user1',
      roomId: 'conv1',
      content: 'All good here!',
      isRead: true,
      isDelivered: true,
      createdAt: '2025-06-19T03:46:00Z',
      updatedAt: '2025-06-19T03:46:00Z',
    },
  ],
  conv2: [
    {
      _id: 'msg2',
      senderId: CURRENT_USER_ID,
      receiverId: 'user2',
      roomId: 'conv2',
      content: 'Let’s catch up soon!',
      isRead: true,
      isDelivered: true,
      createdAt: '2025-06-18T15:30:00Z',
      updatedAt: '2025-06-18T15:30:00Z',
    },
  ],
};

// Mock storage for new conversations and messages
let mockConversationStore = [...mockConversations];
let mockMessageStore = { ...mockMessages };

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

export interface FollowingUser {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

export interface FollowingResponse {
  users: FollowingUser[];
  total: number;
  page: number;
  totalPages: number;
}

export const chatApi = {
  createConversation: async (user2: string): Promise<ApiConversation> => {
    const newConversation: ApiConversation = {
      _id: `conv_${Date.now()}`,
      participants: [CURRENT_USER_ID, user2],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockConversationStore.push(newConversation);
    return newConversation;
  },
  sendMessage: async (messageData: {
    senderId: string;
    receiverId: string;
    roomId: string;
    content: string;
  }): Promise<ApiMessage> => {
    const newMessage: ApiMessage = {
      _id: `msg_${Date.now()}`,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      roomId: messageData.roomId,
      content: messageData.content,
      isRead: false,
      isDelivered: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMessageStore[messageData.roomId] = [
      ...(mockMessageStore[messageData.roomId] || []),
      newMessage,
    ];
    mockConversationStore = mockConversationStore.map(conv =>
      conv._id === messageData.roomId
        ? {
            ...conv,
            lastMessage: {
              _id: newMessage._id,
              content: newMessage.content,
              senderId: newMessage.senderId,
              createdAt: newMessage.createdAt,
              isRead: newMessage.isRead,
              isDelivered: newMessage.isDelivered,
            },
            updatedAt: newMessage.updatedAt,
          }
        : conv
    );
    return newMessage;
  },
  markMessagesDelivered: async (messageIds: string[]): Promise<void> => {
    Object.keys(mockMessageStore).forEach(roomId => {
      mockMessageStore[roomId] = mockMessageStore[roomId].map(msg =>
        messageIds.includes(msg._id) ? { ...msg, isDelivered: true } : msg
      );
    });
  },
  markMessageDelivered: async (messageId: string): Promise<void> => {
    Object.keys(mockMessageStore).forEach(roomId => {
      mockMessageStore[roomId] = mockMessageStore[roomId].map(msg =>
        msg._id === messageId ? { ...msg, isDelivered: true } : msg
      );
    });
  },
  markMessageRead: async (messageId: string): Promise<void> => {
    Object.keys(mockMessageStore).forEach(roomId => {
      mockMessageStore[roomId] = mockMessageStore[roomId].map(msg =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      );
    });
  },
  markRoomMessagesRead: async (roomId: string): Promise<void> => {
    if (mockMessageStore[roomId]) {
      mockMessageStore[roomId] = mockMessageStore[roomId].map(msg => ({
        ...msg,
        isRead: true,
      }));
    }
  },
  getConversations: async (): Promise<ApiConversation[]> => {
    return mockConversationStore;
  },
  getMessages: async (roomId: string): Promise<ApiMessage[]> => {
    return mockMessageStore[roomId] || [];
  },
  getUnreadCount: async (userId: string): Promise<number> => {
    let count = 0;
    Object.values(mockMessageStore).forEach(messages =>
      messages.forEach(msg => {
        if (msg.receiverId === userId && !msg.isRead) count++;
      })
    );
    return count;
  },
  getOfflineMessages: async (userId: string): Promise<ApiMessage[]> => {
    const offlineMessages: ApiMessage[] = [];
    Object.values(mockMessageStore).forEach(messages =>
      messages.forEach(msg => {
        if (msg.receiverId === userId && !msg.isDelivered) {
          offlineMessages.push(msg);
        }
      })
    );
    return offlineMessages;
  },
  editMessage: async (messageId: string, newContent: string): Promise<ApiMessage> => {
    let updatedMessage: ApiMessage | null = null;
    Object.keys(mockMessageStore).forEach(roomId => {
      mockMessageStore[roomId] = mockMessageStore[roomId].map(msg => {
        if (msg._id === messageId) {
          updatedMessage = { ...msg, content: newContent, updatedAt: new Date().toISOString() };
          return updatedMessage;
        }
        return msg;
      });
    });
    if (!updatedMessage) throw new Error('Message not found');
    return updatedMessage;
  },
  deleteMessage: async (messageId: string): Promise<void> => {
    Object.keys(mockMessageStore).forEach(roomId => {
      mockMessageStore[roomId] = mockMessageStore[roomId].filter(msg => msg._id !== messageId);
    });
  },
  getFollowing: async (query: string = '', page: number = 1): Promise<FollowingResponse> => {
    const itemsPerPage = 10;
    const filteredUsers = query
      ? mockFollowingUsers.filter(user =>
          user.username.toLowerCase().includes(query.toLowerCase())
        )
      : mockFollowingUsers;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      totalPages: Math.ceil(filteredUsers.length / itemsPerPage),
    };
  },
};