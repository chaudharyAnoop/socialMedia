export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

export enum MessageType {
  Text = "text",
  Image = "image",
  Emoji = "emoji",
}

export interface Message {
  roomId: string | undefined;
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  status?: string;
  type?: MessageType;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
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
