// components/PostModal/PostModal.tsx
import React, { useState, useRef, useCallback } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Smile,
  Volume2,
  VolumeX
} from 'lucide-react';
import type { Post, UserProfile, Comment } from '../../../../types';
import { formatNumber, formatTimeAgo } from '../../../../utils/formatters';
import { mockComments, getRandomComments } from '../../../../data/mockData';
import Avatar from '../../common/Avatar/Avatar';
import styles from './PostModal.module.css';

interface PostModalProps {
  post: Post;
  profile: UserProfile;
  onClose: () => void;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
}

const PostModal: React.FC<PostModalProps> = ({
  post,
  profile,
  onClose,
  isLiked,
  isSaved,
  onLike,
  onSave
}) => {
  const [comments, setComments] = useState<Comment[]>(getRandomComments(5));
  const [newComment, setNewComment] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapRef = useRef<number>(0);
  // Fix: Use number instead of NodeJS.Timeout for browser compatibility
  const singleTapTimeoutRef = useRef<number | undefined>(undefined);

  const emojis = ['❤️', '😍', '🔥', '👏', '😂', '😢', '😮', '😡'];

  const triggerHeartAnimation = useCallback(() => {
    setShowHeartAnimation(true);
    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 1000);
  }, []);

  const handleImageDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      onLike();
    }
    triggerHeartAnimation();
  }, [isLiked, onLike, triggerHeartAnimation]);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const currentTime = Date.now();
    const tapLength = 300;

    if (lastTapRef.current && (currentTime - lastTapRef.current) < tapLength) {
      // Double tap detected
      if (singleTapTimeoutRef.current) {
        clearTimeout(singleTapTimeoutRef.current);
      }
      handleImageDoubleClick(e);
      lastTapRef.current = 0;
    } else {
      // Single tap - do nothing or could close modal after delay
      lastTapRef.current = currentTime;
      
      singleTapTimeoutRef.current = setTimeout(() => {
        // Could implement single tap behavior here if needed
      }, tapLength);
    }
  }, [handleImageDoubleClick]);

  // Touch handlers for mobile
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleImageClick(e as any);
  }, [handleImageClick]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        username: profile.username,
        profileImage: profile.profileImage,
        text: newComment.trim(),
        timestamp: new Date(),
        likes: 0
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  };

  const handleCommentLike = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleEmojiClick = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    setShowEmojis(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X className={styles.closeIcon} />
        </button>

        <div className={styles.imageSection}>
          <div 
            className={styles.imageContainer}
            onClick={handleImageClick}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleImageDoubleClick}
          >
            {post.isVideo ? (
              <video
                ref={videoRef}
                src={post.imageUrl}
                className={styles.postVideo}
                autoPlay
                loop
                muted={isMuted}
                controls={false}
              />
            ) : (
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className={styles.postImage}
                draggable={false}
              />
            )}
            
            {/* Heart Animation */}
            {showHeartAnimation && (
              <div className={styles.heartAnimation}>
                <Heart className={styles.animatedHeart} />
              </div>
            )}
            
            {post.isVideo && (
              <button className={styles.muteButton} onClick={toggleMute}>
                {isMuted ? <VolumeX className={styles.muteIcon} /> : <Volume2 className={styles.muteIcon} />}
              </button>
            )}
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <Avatar
                src={profile.profileImage}
                alt={profile.fullName}
                size="small"
              />
              <span className={styles.username}>{profile.username}</span>
              {profile.isVerified && (
                <svg className={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <button className={styles.moreButton}>
              <MoreHorizontal className={styles.moreIcon} />
            </button>
          </div>

          <div className={styles.commentsSection}>
            {post.caption && (
              <div className={styles.mainComment}>
                <Avatar
                  src={profile.profileImage}
                  alt={profile.fullName}
                  size="small"
                />
                <div className={styles.commentContent}>
                  <span className={styles.commentUsername}>{profile.username}</span>
                  <span className={styles.commentText}>{post.caption}</span>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentTime}>{formatTimeAgo(post.timestamp || new Date())}</span>
                  </div>
                </div>
              </div>
            )}

            {comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <Avatar
                  src={comment.profileImage}
                  alt={comment.username}
                  size="small"
                />
                <div className={styles.commentContent}>
                  <span className={styles.commentUsername}>{comment.username}</span>
                  <span className={styles.commentText}>{comment.text}</span>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentTime}>{formatTimeAgo(comment.timestamp)}</span>
                    <button className={styles.commentAction}>Reply</button>
                    {comment.likes > 0 && (
                      <span className={styles.commentLikes}>
                        {formatNumber(comment.likes)} likes
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  className={styles.likeComment}
                  onClick={() => handleCommentLike(comment.id)}
                >
                  <Heart 
                    className={`${styles.commentLikeIcon} ${
                      likedComments.has(comment.id) ? styles.liked : ''
                    }`} 
                  />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.actions}>
              <div className={styles.leftActions}>
                <button className={styles.actionButton} onClick={onLike}>
                  <Heart className={`${styles.actionIcon} ${isLiked ? styles.liked : ''}`} />
                </button>
                <button className={styles.actionButton}>
                  <MessageCircle className={styles.actionIcon} />
                </button>
                <button className={styles.actionButton}>
                  <Send className={styles.actionIcon} />
                </button>
              </div>
              <button className={styles.actionButton} onClick={onSave}>
                <Bookmark className={`${styles.actionIcon} ${isSaved ? styles.saved : ''}`} />
              </button>
            </div>
            
            <div className={styles.likesCount}>
              {formatNumber(post.likes + (isLiked ? 1 : 0))} likes
            </div>
            
            <div className={styles.timestamp}>
              {formatTimeAgo(post.timestamp || new Date()).toUpperCase()}
            </div>
          </div>

          <div className={styles.commentInput}>
            <button 
              className={styles.emojiToggle}
              onClick={() => setShowEmojis(!showEmojis)}
            >
              <Smile className={styles.emojiIcon} />
            </button>
            
            {showEmojis && (
              <div className={styles.emojiPicker}>
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className={styles.emojiButton}
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.input}
            />
            
            <button 
              className={styles.postButton}
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;