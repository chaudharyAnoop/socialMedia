// components.tsx - Updated with Edit Profile functionality
import React, { useState, useEffect } from 'react';
import { User, Post, FollowUser, fetchFollowers, fetchFollowing } from './api';
import styles from './ProfilePage.module.css';

// Profile Header Component
interface ProfileHeaderProps {
  user: User;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  onFollowersClick, 
  onFollowingClick,
  onEditProfile
}) => {
  const getAvatar = (username: string, profilePicture?: string) => {
    return profilePicture || `https://ui-avatars.com/api/?name=${username}&background=333&color=fff&size=150`;
  };

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profilePictureContainer}>
        <img
          src={getAvatar(user.username, user.profilePicture)}
          alt={user.username}
          className={styles.profilePicture}
        />
      </div>
      
      <div className={styles.profileInfo}>
        <div className={styles.usernameSection}>
          <h1 className={styles.username}>
            {user.username}
            {user.isVerified && <span className={styles.verified}>✓</span>}
          </h1>
          <button className={styles.editButton} onClick={onEditProfile}>
            Edit profile
          </button>
          <button className={styles.settingsButton}>⚙️</button>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{user.postsCount.toLocaleString()}</span>
            <span className={styles.statLabel}>posts</span>
          </div>
          <button className={styles.stat} onClick={onFollowersClick}>
            <span className={styles.statNumber}>{user.followersCount.toLocaleString()}</span>
            <span className={styles.statLabel}>followers</span>
          </button>
          <button className={styles.stat} onClick={onFollowingClick}>
            <span className={styles.statNumber}>{user.followingCount.toLocaleString()}</span>
            <span className={styles.statLabel}>following</span>
          </button>
        </div>
        
        <div className={styles.bio}>
          <div className={styles.fullName}>{user.fullName}</div>
          <div className={styles.bioText}>{user.bio}</div>
          {user.website && (
            <a href={user.website} className={styles.website} target="_blank" rel="noopener noreferrer">
              {user.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Posts Grid Component
interface PostsGridProps {
  posts: Post[];
  loading?: boolean;
  emptyMessage?: string;
}

export const PostsGrid: React.FC<PostsGridProps> = ({ 
  posts, 
  loading = false, 
  emptyMessage = "No Posts Yet" 
}) => {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📷</div>
        <h3>{emptyMessage}</h3>
        <p>When you share photos, they'll appear on your profile.</p>
    
      </div>
    );
  }

  return (
    <div className={styles.postsGrid}>
      {posts.map((post) => (
        <div
          key={post.id}
          className={styles.postItem}
          onMouseEnter={() => setHoveredPost(post.id)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className={styles.postImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/300';
            }}
          />
          {hoveredPost === post.id && (
            <div className={styles.postOverlay}>
              <div className={styles.postStats}>
                <span>❤️ {post.likesCount.toLocaleString()}</span>
                <span>💬 {post.commentsCount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Follow Modal Component
interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
  count: number;
}

export const FollowModal: React.FC<FollowModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  count 
}) => {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, type]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = type === 'followers' ? await fetchFollowers() : await fetchFollowing();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {type === 'followers' ? 'Followers' : 'Following'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalContent}>
          {loading ? (
            <div className={styles.modalLoading}>
              <div className={styles.spinner}></div>
            </div>
          ) : users.length === 0 ? (
            <div className={styles.emptyList}>
              No {type} to show
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className={styles.userItem}>
                <div className={styles.userAvatar}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{user.username}</span>
                <button className={styles.followButton}>Follow</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Tabs Component
interface ProfileTabsProps {
  activeTab: 'posts' | 'reels' | 'tagged';
  onTabChange: (tab: 'posts' | 'reels' | 'tagged') => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`}
        onClick={() => onTabChange('posts')}
      >
        <span className={styles.tabIcon}>⊞</span>
        <span>POSTS</span>
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'reels' ? styles.activeTab : ''}`}
        onClick={() => onTabChange('reels')}
      >
        <span className={styles.tabIcon}>▶</span>
        <span>REELS</span>
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'tagged' ? styles.activeTab : ''}`}
        onClick={() => onTabChange('tagged')}
      >
        <span className={styles.tabIcon}>👤</span>
        <span>TAGGED</span>
      </button>
    </div>
  );
};