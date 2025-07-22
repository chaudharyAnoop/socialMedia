
import React, { useState, useEffect } from 'react';
import { User, Post, fetchUserProfile, fetchTaggedPosts } from './api';
import { ProfileHeader, PostsGrid, FollowModal, ProfileTabs } from './components';
import { EditProfileModal } from './EditProfileModal';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [taggedPosts, setTaggedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadProfile();
    loadTaggedPosts();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserProfile();
      setUser(userData);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadTaggedPosts = async () => {
    try {
      setPostsLoading(true);
      const posts = await fetchTaggedPosts();
      setTaggedPosts(posts);
    } catch (err) {
      console.error('Failed to load tagged posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Modal handlers
  const handleFollowersClick = () => {
    setModalType('followers');
    setModalOpen(true);
  };

  const handleFollowingClick = () => {
    setModalType('following');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Edit profile handlers
  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
      // Here you would typically make an API call to save the changes
      console.log('Saving profile changes:', updatedUser);
    }
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return <PostsGrid posts={[]} emptyMessage="No Posts Yet" />;
      case 'reels':
        return (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎬</div>
            <h3>No Reels Yet</h3>
            <p>Create your first reel to get started!</p>
          </div>
        );
      case 'tagged':
        return <PostsGrid posts={taggedPosts} loading={postsLoading} emptyMessage="No Tagged Posts" />;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error || 'User not found'}</p>
          <button className={styles.retryButton} onClick={loadProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onEditProfile={handleEditProfile}
        />

        {/* Profile Tabs */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {renderTabContent()}
        </div>
      </div>

      {/* Follow Modal */}
      <FollowModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        count={modalType === 'followers' ? user.followersCount : user.followingCount}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;