import {memo} from 'react';
import styles from './FilterTabs.module.css';
import { NotificationData } from '../../../data/notifications';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  notifications: NotificationData[];
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  notifications
}) => {
  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'like', label: 'Likes' },
    { key: 'follow', label: 'Follows' },
    { key: 'comment', label: 'Comments' }
  ];

  const getNotificationCount = (filterKey: string) => {
    if (filterKey === 'all') return notifications.length;
    return notifications.filter(n => n.type === filterKey).length;
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTabs}>
        {filterOptions.map((filter) => {
          const count = getNotificationCount(filter.key);
          return (
            <button
              key={filter.key}
              className={`${styles.filterTab} ${activeFilter === filter.key ? styles.active : ''}`}
              onClick={() => onFilterChange(filter.key)}
            >
              {filter.label}
              {count > 0 && <span className={styles.countBadge}>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(FilterTabs);
