// components/MobileNavigation/MobileNavigation.tsx
import React from 'react';
import { ArrowLeft, MoreVertical, Bell, MessageCircle } from 'lucide-react';
import styles from './MobileNavigation.module.css';

interface MobileNavigationProps {
  username: string;
  onBack?: () => void;
  onNotifications?: () => void;
  onMessages?: () => void;
  onMore?: () => void;
  showBackButton?: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  username,
  onBack,
  onNotifications,
  onMessages,
  onMore,
  showBackButton = false
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        {showBackButton ? (
          <button className={styles.iconButton} onClick={onBack}>
            <ArrowLeft className={styles.icon} />
          </button>
        ) : (
          <div className={styles.spacer} />
        )}
      </div>
      
      <div className={styles.centerSection}>
        <h1 className={styles.username}>{username}</h1>
      </div>
      
      <div className={styles.rightSection}>
        <button className={styles.iconButton} onClick={onNotifications}>
          <Bell className={styles.icon} />
        </button>
        <button className={styles.iconButton} onClick={onMessages}>
          <MessageCircle className={styles.icon} />
        </button>
        <button className={styles.iconButton} onClick={onMore}>
          <MoreVertical className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;