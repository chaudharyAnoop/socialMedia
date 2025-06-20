

import React, {
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useEffect
} from 'react';

import axios from 'axios';
import { NotificationData, sampleNotifications } from '../../../data/notifications';
import styles from './NotificationsPage.module.css';
import { Heart } from 'lucide-react';
import { formatNotification } from '../formatNotification';
import { Notification_URL } from '../BaseUrl';
// Lazy loaded components
const NotificationHeader = lazy(() => import('../NotificationHeader/NotificationHeader'));
const FilterTabs = lazy(() => import('../FilterTabs/FilterTabs'));
const NotificationItem = lazy(() => import('../NotificationItem/NotificationItem'));

const NotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const handleDeleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const handleFollowToggle = useCallback((id: string, isFollowing: boolean) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isFollowing } : notification
      )
    );
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification =>
      activeFilter === 'all' ? true : notification.type === activeFilter
    );
  }, [notifications, activeFilter]);
  let token = localStorage.getItem("instagram_user");
  let cleanedUser = token;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(Notification_URL, {
          headers: {
            Authorization: `Bearer ${cleanedUser}`
          }
        });// Replace with your actual endpoint
        console.log(res);
        const rawData = res.data.data || [] ;
        console.log(rawData);

        const formatted: NotificationData[] = rawData
          ?.map(formatNotification)
          ?.filter((n : any): n is NotificationData => n !== null); // Remove unsupported types

        setNotifications(formatted);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setNotifications(sampleNotifications); // fallback
      }
    };
    
    fetchNotifications();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Suspense fallback={<div>Loading header...</div>}>
          <NotificationHeader />
        </Suspense>

        <Suspense fallback={<div>Loading filters...</div>}>
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            notifications={notifications}
          />
        </Suspense>

        <div className={styles.notificationsContainer}>
  {filteredNotifications.length > 0 ? (
    <>
      <div className={styles.swipeInstruction}>
        ← Swipe left to delete notifications
      </div>
      <Suspense fallback={<div>Loading notifications...</div>}>
        <div className={styles.scrollContainer}>
          {filteredNotifications?.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={handleDeleteNotification}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </div>
      </Suspense>
    </>
  ) : (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <Heart size={48} color="#1877f2" />
      </div>
      <div className={styles.emptyTitle}>No notifications</div>
      <div className={styles.emptyText}>
        You're all caught up! Check back later for new notifications.
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default React.memo(NotificationsPage);
