import axios from 'axios';

const BASE_URL = 'http://172.50.5.116:3010';
const BASE_URL1 = 'http://172.50.5.116:3011';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('access_token');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};
const apiUsers = axios.create({
  baseURL: BASE_URL1,
  headers,
});

const addAuthInterceptor = (instance: any) => {
  instance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

addAuthInterceptor(api);
addAuthInterceptor(apiUsers);

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
  sender: string;
  receiver: string;
  roomId: string;
  content: string;
  isRead: boolean;
  isDelivered: boolean;
  senderUsername?: string;
  senderFullName?: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
}

export interface FollowingUser {
  _id: string;
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
  createConversation: async (user2: string) => {
    const response = await api.post('/chat/conversation', { user2 });
    return response.data;
  },
  sendMessage: async (messageData: {
    senderId: string;
    receiverId: string;
    roomId: string;
    content: string;
  }) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },
  markMessagesDelivered: async (messageIds: string[]) => {
    const response = await api.patch('/chat/messages/delivered', { messageIds });
    return response.data;
  },
  markMessageDelivered: async (messageId: string) => {
    const response = await api.patch(`/chat/message/${messageId}/delivered`);
    return response.data;
  },
  markMessageRead: async (messageId: string) => {
    const response = await api.patch(`/chat/message/read/${messageId}`);
    return response.data;
  },
  markRoomMessagesRead: async (roomId: string) => {
    const response = await api.patch(`/chat/message/read/room/${roomId}`);
    return response.data;
  },
  getConversations: async (): Promise<ApiConversation[]> => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },
  getMessages: async (roomId: string): Promise<ApiMessage[]> => {
    const response = await api.get(`/chat/messages/${roomId}`);
    return response.data;
  },
  getUnreadCount: async (userId: string) => {
    const response = await api.get(`/chat/message/unread/${userId}`);
    return response.data;
  },
  getOfflineMessages: async (userId: string) => {
    const response = await api.get(`/chat/offline/${userId}`);
    return response.data;
  },
  editMessage: async (messageId: string, newContent: string) => {
    const response = await api.put(`/chat/message/${messageId}`, {
      messageId,
      newContent,
    });
    return response.data;
  },
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/chat/message/${messageId}`);
    return response.data;
  },
  getFollowing: async (query: string, page: number): Promise<FollowingResponse> => {
    const response = await apiUsers.get(`/users/me/following/search?query=${query}&page=${page}`);
    return response.data;
  },
  getUser: async (userId: string) => {
    const response = await apiUsers.get(`/users/${userId}`);
    return response.data;
  },
};