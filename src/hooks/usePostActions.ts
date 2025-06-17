// hooks/usePostActions.ts - Simplified Post Interactions

import { useState, useCallback } from 'react';
import { usePosts, useComments } from '../contexts/AppContext';
import type { Post, Comment } from '../types';

export const usePostActions = (postId: string) => {
  const { posts, likedPosts, savedPosts, likePost, unlikePost, savePost, unsavePost } = usePosts();
  const { comments, addComment } = useComments();
  
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const post = posts.find(p => p.id === postId);
  const postComments = comments[postId] || [];
  const isLiked = likedPosts.has(postId);
  const isSaved = savedPosts.has(postId);

  // Handle like with animation
  const handleLike = useCallback(async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
      // Show heart animation for new likes
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
    
    // Simulate API delay
    setTimeout(() => setIsLiking(false), 300);
  }, [isLiked, isLiking, postId, likePost, unlikePost]);

  // Handle double-tap like
  const handleDoubleTapLike = useCallback(() => {
    if (!isLiked) {
      likePost(postId);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
  }, [isLiked, postId, likePost]);

  // Handle save/unsave
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    if (isSaved) {
      unsavePost(postId);
    } else {
      savePost(postId);
    }
    
    setTimeout(() => setIsSaving(false), 300);
  }, [isSaved, isSaving, postId, savePost, unsavePost]);

  // Handle add comment
  const handleAddComment = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const newComment: Omit<Comment, 'id' | 'timestamp' | 'likes'> = {
      username: 'current_user', // In real app, get from auth
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      text: text.trim(),
    };
    
    addComment(postId, newComment);
  }, [postId, addComment]);

  return {
    post,
    postComments,
    isLiked,
    isSaved,
    isLiking,
    isSaving,
    showHeartAnimation,
    handleLike,
    handleDoubleTapLike,
    handleSave,
    handleAddComment,
  };
};