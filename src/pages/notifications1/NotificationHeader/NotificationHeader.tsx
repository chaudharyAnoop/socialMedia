// src/components/Notifications/NotificationHeader.tsx
import React , {memo} from 'react';
import styles from './NotificationHeader.module.css';


const NotificationHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Notifications</h1>
    </div>
  );
};

export default   memo(NotificationHeader);