import { Message } from "./types";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`${styles.container} ${isOwn ? styles.containerOwn : styles.containerOther}`}>
      <div className={`${styles.messageWrapper} ${isOwn ? styles.messageWrapperOwn : styles.messageWrapperOther}`}>
        <div
          className={`${styles.messageBubble} ${
            isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther
          }`}
        >
          <p className={styles.messageText}>{message.text}</p>
        </div>
        
        <div className={`${styles.timestamp} ${isOwn ? styles.timestampOwn : styles.timestampOther}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;