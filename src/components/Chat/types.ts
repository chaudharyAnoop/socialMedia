export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  roomId: string | undefined;
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  isRead: boolean;
  type?: 'text' | 'image' | 'emoji';
}

export interface Chat {
  roomId: string | undefined;
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
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