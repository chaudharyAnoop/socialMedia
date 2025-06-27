import React, { useState, useEffect } from "react";

import styles from "./ProfilePage.module.css";

import { User, Post, fetchUserProfile, fetchTaggedPosts } from "./api";
import {
  ProfileHeader,
  PostsGrid,
  FollowModal,
  ProfileTabs,
} from "./components";
import { EditProfileModal } from "./EditProfileModal";

import {
  ProfileTabsEnum,
  ProfileModalTypeEnum,
} from "../../enums/ProfileTabsEnum";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [taggedPosts, setTaggedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTabsEnum>(
    ProfileTabsEnum.Posts
  );

  // Wrapper to convert enum to string for ProfileTabs component
  const handleTabChange = (tab: "posts" | "reels" | "tagged") => {
    setActiveTab(tab as ProfileTabsEnum);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ProfileModalTypeEnum>(
    ProfileModalTypeEnum.Followers
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

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
      setError("Failed to load profile");
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
      console.error("Failed to load tagged posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleFollowersClick = () => {
    setModalType(ProfileModalTypeEnum.Followers);
    setModalOpen(true);
  };

  const handleFollowingClick = () => {
    setModalType(ProfileModalTypeEnum.Following);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
      console.log("Saving profile changes:", updatedUser);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return <PostsGrid posts={[]} emptyMessage="No Posts Yet" />;
      case "reels":
        return (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎬</div>
            <h3>No Reels Yet</h3>
            <p>Create your first reel to get started!</p>
          </div>
        );
      case "tagged":
        return (
          <PostsGrid
            posts={taggedPosts}
            loading={postsLoading}
            emptyMessage="No Tagged Posts"
          />
        );
      default:
        return null;
    }
  };

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
  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error || "User not found"}</p>
          <button className={styles.retryButton} onClick={loadProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ProfileHeader
          user={user}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onEditProfile={handleEditProfile}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className={styles.tabContent}>{renderTabContent()}</div>
      </div>

      <FollowModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        count={
          modalType === "followers" ? user.followersCount : user.followingCount
        }
      />

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
