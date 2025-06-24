import { io, Socket } from 'socket.io-client';
import { ApiMessage } from './chatApi';

class SocketService {
  private socket: Socket | null = null;
  private currentUserId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.currentUserId = userId;
    const token = localStorage.getItem('access_token'); // Use access_token
    this.socket = io(`ws://172.50.5.116:3010/chat?token=${token}`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      if (userId) this.socket?.emit('user:online', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('auth_error', ({ message }) => {
      console.error('Socket auth error:', message);
      this.disconnect();
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentUserId = null;
    }
  }

  joinRoom(roomId: string) {
    this.socket?.emit('join_room', { roomId });
  }

  joinOrCreateRoom(participantId: string) {
    this.socket?.emit('join_or_create_room', { participantId });
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('room:leave', { roomId });
  }

  sendMessage(messageData: { roomId: string; receiverId: string; content: string }) {
    this.socket?.emit('send_message', messageData);
  }

  onMessageSent(callback: (message: any) => void) {
    this.socket?.on('message_sent', callback);
  }

  onNewMessage(callback: (message: ApiMessage & { senderUsername: string; senderFullName: string }) => void) {
    this.socket?.on('receive_message', callback);
  }

  onMessageDelivered(callback: (data: { messageId: string; deliveredBy: string; deliveredAt: string }) => void) {
    this.socket?.on('message_delivered', callback);
  }

  onMessageStatusUpdate(callback: (data: { messageId: string; readBy: string; timeStamp: string }) => void) {
    this.socket?.on('message_read_ack', callback);
  }

  onMessageEdited(callback: (data: { messageId: string; newContent: string; editedAt: string }) => void) {
    this.socket?.on('message_edited', callback);
  }

  onMessageDeleted(callback: (data: { messageId: string; deletedAt: string }) => void) {
    this.socket?.on('message_deleted', callback);
  }

  editMessage(messageId: string, newContent: string) {
    this.socket?.emit('edit_message', { messageId, newContent });
  }

  deleteMessage(messageId: string) {
    this.socket?.emit('delete_message', { messageId });
  }

  markRead(messageId: string) {
    this.socket?.emit('message_read', { messageId });
  }

  // Pending backend confirmation for these events
  onTyping(callback: (data: { userId: string; roomId: string; isTyping: boolean }) => void) {
    this.socket?.on('user:typing', callback);
  }   // remove this if not provided by backend

  sendTyping(roomId: string, isTyping: boolean) {
    this.socket?.emit('user:typing', { roomId, isTyping });
  }   // remove this if not provided by backend

  onUserStatusChange(callback: (data: { userId: string; isOnline: boolean; lastSeen?: Date }) => void) {
    this.socket?.on('user:status', callback);
  }    // remove this if not provided by backend

  off(event: string, callback?: any) {
    this.socket?.off(event, callback);
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();