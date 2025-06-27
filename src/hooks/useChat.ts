import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { socketService } from "../services/socketService";
import { ApiMessage } from "../services/chatApi";
import {
  receiveMessage,
  updateMessageDelivered,
  updateMessageEdited,
  updateMessageDeleted,
  updateMessageStatus,
  updateUserStatus,
  updateTyping,
  sendMessageReal,
} from "../redux/chatSlice/chatSlice";
import { useAppDispatch } from "../redux/hooks";

export const useChat = () => {
  const { user } = useAuth();
  const CURRENT_USER_ID = user?._id || "guest";
  const dispatch = useAppDispatch();
  const typingTimeoutRef = useRef<{ [roomId: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    socketService.connect(CURRENT_USER_ID);
    socketService.onMessageSent((message) => {
      if (user?._id) dispatch(sendMessageReal({ message, id: user._id }));
    });

    socketService.onNewMessage((message) => {
      console.log("Received new message:", message);
      const convertedMessage = convertApiMessageToMessage(message);
      dispatch(receiveMessage(convertedMessage));
    });

    socketService.onMessageDelivered(({ messageId }) => {
      console.log("hiii");
      dispatch(updateMessageDelivered({ messageId }));
    });

    socketService.onMessageEdited(({ messageId, newContent }) => {
      dispatch(updateMessageEdited({ messageId, newContent }));
    });

    socketService.onMessageDeleted(({ messageId }) => {
      dispatch(updateMessageDeleted({ messageId }));
    });

    socketService.onMessageStatusUpdate(({ messageId }) => {
      dispatch(updateMessageStatus({ messageId }));
    });

    socketService.onUserStatusChange(({ userId, isOnline }) => {
      dispatch(updateUserStatus({ userId, isOnline }));
    });

    socketService.onTyping(({ userId, roomId, isTyping }) => {
      dispatch(updateTyping({ userId, roomId, isTyping }));
    });

    return () => socketService.disconnect();
  }, [dispatch]);

  const convertApiMessageToMessage = (apiMessage: ApiMessage) => ({
    id: apiMessage._id,
    text: apiMessage.content,
    timestamp: new Date(apiMessage.createdAt).toISOString(),
    senderId:
      apiMessage.sender === CURRENT_USER_ID ? "current" : apiMessage.sender,
    status: apiMessage.status || "sent",
    roomId: apiMessage.roomId,
  });

  const sendTyping = (roomId: string, isTyping: boolean) => {
    socketService.sendTyping(roomId, isTyping);
    if (isTyping) {
      if (typingTimeoutRef.current[roomId]) {
        clearTimeout(typingTimeoutRef.current[roomId]);
      }
      typingTimeoutRef.current[roomId] = setTimeout(() => {
        socketService.sendTyping(roomId, false);
      }, 3000);
    }
  };
};
