// hooks/useProfile.ts
import { useState, useCallback } from 'react';
import type { TabType, Post } from '../types';

export const useProfile = () => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const handleFollowToggle = useCallback(() => {
    setIsFollowing(prev => !prev);
  }, []);

  const handlePostClick = useCallback((post: Post) => {
    setSelectedPost(post);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const handleLikePost = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const handleSavePost = useCallback((postId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  return {
    activeTab,
    setActiveTab,
    isFollowing,
    selectedPost,
    likedPosts,
    savedPosts,
    handleFollowToggle,
    handlePostClick,
    handleCloseModal,
    handleLikePost,
    handleSavePost
  };
};