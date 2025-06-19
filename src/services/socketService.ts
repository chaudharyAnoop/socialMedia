// src/services/socketService.ts
import mitt from 'mitt';
import { ApiMessage } from './chatApi';

const mockSocket = mitt();
const CURRENT_USER_ID = 'current_user_id';
let joinedRooms: string[] = [];
let isConnected = false;

export const socketService = {
  connect: (userId: string) => {
    if (!isConnected) {
      isConnected = true;
      // Simulate user online status
      setTimeout(() => {
        mockSocket.emit('userStatus', { userId: 'user1', isOnline: true });
        mockSocket.emit('userStatus', { userId: 'user3', isOnline: true });
      }, 1000);
    }
  },
  disconnect: () => {
    isConnected = false;
    joinedRooms = [];
    mockSocket.all.clear(); // Clear all listeners
  },
  joinRoom: (roomId: string) => {
    if (!joinedRooms.includes(roomId)) {
      joinedRooms.push(roomId);
    }
  },
  sendMessage: (messageData: {
    senderId: string;
    receiverId: string;
    roomId: string;
    content: string;
  }) => {
    const message: ApiMessage = {
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
    // Simulate new message event
    mockSocket.emit('newMessage', message);
    // Simulate auto-reply from other user after a delay
    if (messageData.senderId === CURRENT_USER_ID && joinedRooms.includes(messageData.roomId)) {
      setTimeout(() => {
        const reply: ApiMessage = {
          _id: `msg_${Date.now()}`,
          senderId: messageData.receiverId,
          receiverId: CURRENT_USER_ID,
          roomId: messageData.roomId,
          content: `Reply to: ${messageData.content}`,
          isRead: false,
          isDelivered: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockSocket.emit('newMessage', reply);
      }, 2000);
    }
  },
  sendTyping: (roomId: string, isTyping: boolean) => {
    if (joinedRooms.includes(roomId)) {
      mockSocket.emit('typing', {
        userId: CURRENT_USER_ID,
        roomId,
        isTyping,
      });
      // Simulate other user typing
      if (isTyping) {
        setTimeout(() => {
          mockSocket.emit('typing', {
            userId: roomId === 'conv1' ? 'user1' : 'user2',
            roomId,
            isTyping: true,
          });
          setTimeout(() => {
            mockSocket.emit('typing', {
              userId: roomId === 'conv1' ? 'user1' : 'user2',
              roomId,
              isTyping: false,
            });
          }, 1000);
        }, 500);
      }
    }
  },
  onNewMessage: (callback: (message: ApiMessage) => void) => {
    mockSocket.on('newMessage', callback);
  },
  onMessageStatusUpdate: (callback: (data: { messageId: string; status: 'delivered' | 'read' }) => void) => {
    mockSocket.on('messageStatus', callback);
  },
  onUserStatusChange: (callback: (data: { userId: string; isOnline: boolean }) => void) => {
    mockSocket.on('userStatus', callback);
  },
  onTyping: (callback: (data: { userId: string; roomId: string; isTyping: boolean }) => void) => {
    mockSocket.on('typing', callback);
  },
};