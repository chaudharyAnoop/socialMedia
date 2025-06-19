import { Chat } from "./types";
import styles from "./ChatListItem.module.css";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${styles.container} ${isSelected ? styles.selected : ''}`}
    >
      {/* Avatar */}
      <div className={styles.avatarContainer}>
        <img
          src={"https://picsum.photos/800/600"}
          alt={chat.user.username}
          className={styles.avatar}
        />
        {chat.user.isOnline && (
          <div className={styles.onlineIndicator}></div>
        )}
      </div>

      {/* Chat Info */}
      <div className={styles.chatInfo}>
        <div className={styles.topRow}>
          <span className={styles.username}>
            {chat.user.username}
          </span>
          <span className={styles.timestamp}>
            {formatTime(chat.lastMessage.timestamp)}
          </span>
        </div>
        
        <div className={styles.bottomRow}>
          <p className={`${styles.lastMessage} ${
            chat.unreadCount > 0 ? styles.lastMessageUnread : ''
          }`}>
            {chat.lastMessage.senderId === 'current' && 'You: '}
            {chat.lastMessage.text}
          </p>
          
          {chat.unreadCount > 0 && (
            <div className={styles.unreadBadge}>
              <span className={styles.unreadCount}>
                {chat.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;