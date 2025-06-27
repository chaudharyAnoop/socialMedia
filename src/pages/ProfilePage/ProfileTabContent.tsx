import React from "react";
import styles from "./ProfileTabContent.module.css";
import { Post } from "./api";
import { PostsGrid } from "./components";

interface ProfileTabContentProps {
  activeTab: "posts" | "reels" | "tagged";
  taggedPosts: Post[];
  postsLoading: boolean;
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  activeTab,
  taggedPosts,
  postsLoading,
}) => {
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

export default ProfileTabContent;
