// src/components/Notifications/NotificationItem.tsx
import React, { useState, useRef , memo} from 'react';
import { Heart, MessageCircle, UserPlus, UserCheck, AtSign, Trash2 } from 'lucide-react';
import { NotificationData } from '../../../data/notifications';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: NotificationData;
  onDelete: (id: string) => void;
  onFollowToggle: (id: string, isFollowing: boolean) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onDelete,
  onFollowToggle
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setDragX(Math.min(0, diff));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragX < -100) {
      setTimeout(() => onDelete(notification.id), 200);
    }
    setDragX(0);
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setDragX(Math.min(0, diff));
  };

  const handleMouseEnd = () => {
    setIsDragging(false);
    if (dragX < -100) {
      setTimeout(() => onDelete(notification.id), 200);
    }
    setDragX(0);
  };

  const handleFollowToggle = () => {
    onFollowToggle(notification.id, !notification.isFollowing);
  };

  const getIcon = () => {
    const iconStyle = { width: '16px', height: '16px' };

    switch (notification.type) {
      case 'like': return <Heart fill="#ff3040" color="#ff3040" style={iconStyle} />;
      case 'follow': return notification.isFollowing 
        ? <UserCheck color="#4CAF50" style={iconStyle} /> 
        : <UserPlus color="#1877f2" style={iconStyle} />;
      case 'comment': return <MessageCircle color="#00d4aa" style={iconStyle} />;
      case 'mention': return <AtSign color="#ff9500" style={iconStyle} />;
      default: return null;
    }
  };

  const getNotificationText = () => {
    switch (notification.type) {
      case 'like': return 'liked your post';
      case 'follow': return notification.isFollowing 
        ? 'is now following you' 
        : 'started following you';
      case 'comment': return `commented: ${notification.content}`;
      case 'mention': return notification.content || 'mentioned you';
      default: return '';
    }
  };

  const getTypeColor = () => {
    if (notification.type === 'follow' && notification.isFollowing) {
      return '#4CAF50'; // Green for following state
    }
    switch (notification.type) {
      case 'like': return '#ff3040';
      case 'follow': return '#1877f2';
      case 'comment': return '#00d4aa';
      case 'mention': return '#ff9500';
      default: return '#1877f2';
    }
  };

  return (
    <div
      ref={itemRef}
      className={styles.notificationItem}
      style={{
        transform: `translateX(${dragX}px)`,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseStart}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleMouseEnd}
      onMouseLeave={handleMouseEnd}
    >
      <div 
        className={styles.deleteBackground} 
        style={{ opacity: Math.min(1, Math.abs(dragX) / 100) }}
      >
        <Trash2 color="#ffffff" size={20} />
      </div>

      <div 
        className={`${styles.notificationContent} ${notification.isRead ? '' : styles.unread}`}
        style={{ borderLeftColor: getTypeColor() }}
      >
        <div className={styles.avatarContainer}>
          <div className={styles.avatarBorder} style={{ borderColor: getTypeColor() }}>
            <img
              src={notification.user.avatar}
              alt={notification.user.username}
              className={styles.avatar}
            />
          </div>
          <div className={styles.iconContainer}>
            {getIcon()}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.text}>
            <span className={styles.username} style={{ color: getTypeColor() }}>
              {notification.user.username}
            </span>
            {' '}
            <span className={styles.actionText}>
              {getNotificationText()}
            </span>
          </div>
          <div className={styles.timestamp}>
            {notification.timestamp} ago
          </div>
        </div>

        {notification.post ? (
          <div className={styles.postImage}>
            <img
              src={notification.post.image}
              alt="Post"
              className={styles.image}
            />
          </div>
        ) : notification.type === 'follow' ? (
          <button 
            className={`${styles.followButton} ${notification.isFollowing ? styles.followingButton : ''}`}
            onClick={handleFollowToggle}
          >
            {notification.isFollowing ? 'Following' : 'Follow Back'}
            
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default memo(NotificationItem);