// components/PostGrid/EnhancedPostGrid.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Play, Volume2, VolumeX } from 'lucide-react';
import type { Post, TabType } from '../../../types';
import { formatNumber } from '../../../utils/formatters';
import styles from './EnhancedPostGrid.module.css';

interface EnhancedPostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  activeTab: TabType;
  loading?: boolean;
  // Add the missing props with default values
  likedPosts?: Set<string>;
  onLike?: (postId: string) => void;
}

const EnhancedPostGrid: React.FC<EnhancedPostGridProps> = ({ 
  posts, 
  onPostClick, 
  activeTab,
  loading = false,
  likedPosts = new Set(), // Default to empty Set
  onLike // Can be undefined
}) => {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [heartAnimations, setHeartAnimations] = useState<Set<string>>(new Set());
  
  // Refs for double-tap detection
  const lastTapRef = useRef<{ [key: string]: number }>({});
  const singleTapTimeoutRef = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const toggleMute = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleLike = useCallback((postId: string) => {
    // Only call onLike if it exists
    if (onLike) {
      onLike(postId);
    }
  }, [onLike]);

  const triggerHeartAnimation = useCallback((postId: string) => {
    setHeartAnimations(prev => new Set(prev).add(postId));
    setTimeout(() => {
      setHeartAnimations(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }, 1000);
  }, []);

  const handleImageClick = useCallback((post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    const postId = post.id;
    const currentTime = Date.now();
    const tapLength = 300; // Maximum time between taps for double-tap

    if (lastTapRef.current[postId] && (currentTime - lastTapRef.current[postId]) < tapLength) {
      // Double tap detected
      if (singleTapTimeoutRef.current[postId]) {
        clearTimeout(singleTapTimeoutRef.current[postId]);
      }
      
      // Only like if not already liked and onLike exists
      if (onLike && !likedPosts.has(postId)) {
        handleLike(postId);
        triggerHeartAnimation(postId);
      } else if (onLike) {
        // Still show animation even if already liked
        triggerHeartAnimation(postId);
      }
      
      lastTapRef.current[postId] = 0; // Reset
    } else {
      // Single tap - set timeout to open modal if no second tap comes
      lastTapRef.current[postId] = currentTime;
      
      singleTapTimeoutRef.current[postId] = setTimeout(() => {
        onPostClick(post);
      }, tapLength);
    }
  }, [likedPosts, handleLike, triggerHeartAnimation, onPostClick, onLike]);

  // Touch handlers for mobile
  const handleTouchEnd = useCallback((post: Post, e: React.TouchEvent) => {
    e.preventDefault();
    handleImageClick(post, e as any);
  }, [handleImageClick]);

  const getGridClass = () => {
    switch (activeTab) {
      case 'reels':
        return styles.reelsGrid;
      case 'tagged':
        return styles.taggedGrid;
      default:
        return styles.postsGrid;
    }
  };

  if (loading) {
    return (
      <div className={`${styles.grid} ${getGridClass()}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.skeletonPost}>
            <div className={styles.skeletonImage} />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          {activeTab === 'posts' && '📷'}
          {activeTab === 'reels' && '🎬'}
          {activeTab === 'tagged' && '🏷️'}
        </div>
        <h3 className={styles.emptyTitle}>
          {activeTab === 'posts' && 'No posts yet'}
          {activeTab === 'reels' && 'No reels yet'}
          {activeTab === 'tagged' && 'No tagged posts'}
        </h3>
        <p className={styles.emptyText}>
          {activeTab === 'posts' && 'When you share photos, they will appear on your profile.'}
          {activeTab === 'reels' && 'Share your first reel to get started.'}
          {activeTab === 'tagged' && 'When people tag you in photos, they\'ll appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.grid} ${getGridClass()}`}>
      {posts.map(post => (
        <div
          key={post.id}
          className={`${styles.postItem} ${activeTab === 'reels' ? styles.reelItem : ''}`}
          onMouseEnter={() => setHoveredPost(post.id)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          <div 
            className={styles.imageContainer}
            onClick={(e) => handleImageClick(post, e)}
            onTouchEnd={(e) => handleTouchEnd(post, e)}
          >
            <img
              src={post.imageUrl}
              alt="Post"
              className={styles.postImage}
              loading="lazy"
              draggable={false}
            />
            
            {/* Heart Animation */}
            {heartAnimations.has(post.id) && (
              <div className={styles.heartAnimation}>
                <Heart className={styles.animatedHeart} />
              </div>
            )}
          </div>
          
          {post.isVideo && (
            <>
              <div className={styles.videoIndicator}>
                <Play className={styles.playIcon} />
              </div>
              {activeTab === 'reels' && (
                <button 
                  className={styles.muteButton}
                  onClick={(e) => toggleMute(post.id, e)}
                >
                  {mutedVideos.has(post.id) ? (
                    <VolumeX className={styles.muteIcon} />
                  ) : (
                    <Volume2 className={styles.muteIcon} />
                  )}
                </button>
              )}
            </>
          )}
          
          <div className={`${styles.overlay} ${hoveredPost === post.id ? styles.visible : ''}`}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <Heart className={`${styles.statIcon} ${likedPosts.has(post.id) ? styles.liked : ''}`} />
                <span className={styles.statNumber}>
                  {formatNumber(post.likes + (likedPosts.has(post.id) ? 1 : 0))}
                </span>
              </div>
              <div className={styles.stat}>
                <MessageCircle className={styles.statIcon} />
                <span className={styles.statNumber}>{formatNumber(post.comments)}</span>
              </div>
            </div>
          </div>

          {activeTab === 'reels' && (
            <div className={styles.reelInfo}>
              <div className={styles.reelStats}>
                <div className={styles.reelStat}>
                  <Heart className={`${styles.reelStatIcon} ${likedPosts.has(post.id) ? styles.liked : ''}`} />
                  <span>{formatNumber(post.likes + (likedPosts.has(post.id) ? 1 : 0))}</span>
                </div>
                <div className={styles.reelStat}>
                  <MessageCircle className={styles.reelStatIcon} />
                  <span>{formatNumber(post.comments)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EnhancedPostGrid;