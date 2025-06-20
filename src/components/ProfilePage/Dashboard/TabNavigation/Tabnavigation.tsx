// components/TabNavigation/TabNavigation.tsx
import React from 'react';
import { Grid, Play, User } from 'lucide-react';
import type { TabType } from '../../../../types';
import styles from './TabNavigation.module.css';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'posts' as TabType, label: 'Posts', icon: Grid },
    { id: 'reels' as TabType, label: 'Reels', icon: Play },
    { id: 'tagged' as TabType, label: 'Tagged', icon: User }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabsWrapper}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`${styles.tab} ${activeTab === id ? styles.active : ''}`}
          >
            <Icon className={styles.icon} />
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;