import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectPost, likePost, Post } from '../../store/slices/exploreSlice'; // Ensure Post type is imported
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

// Import the CSS module
import styles from './PostModal.module.css'; // Adjust path if your CSS file is elsewhere

const PostModal: React.FC = () => {
  const { selectedPost } = useAppSelector((state) => state.explore);
  const dispatch = useAppDispatch();

  if (!selectedPost) return null;

  const handleClose = () => {
    dispatch(selectPost(null));
  };

  const handleLike = () => {
    dispatch(likePost(selectedPost.id));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Check if the click occurred directly on the backdrop (the outermost div)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
    >
      <div className={styles.modalContent}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <img
            src={selectedPost.imageUrl}
            alt={`Post by ${selectedPost.username}`}
            // No direct className needed here as it's targeted by .imageSection img in CSS
          />
        </div>

        {/* Content Section */}
        <div className={styles.contentSection}>
          {/* Header */}
          <div className={styles.contentHeader}>
            <div className={styles.userInfo}>
              <div className={styles.avatarPlaceholder}>
                <span className={styles.avatarPlaceholderSpan}>
                  {selectedPost.username[0].toUpperCase()}
                </span>
              </div>
              <span className={styles.username}>{selectedPost.username}</span>
            </div>
            <div className={styles.headerButtons}>
              <button className={styles.headerButton}>
                <MoreHorizontal />
              </button>
              <button
                onClick={handleClose}
                className={styles.headerButton}
              >
                <X />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className={styles.commentsSection}>
            <div className={styles.commentList}>
              {/* Sample comments */}
              <div className={styles.commentItem}>
                <div className={styles.commentAvatar}></div>
                <div>
                  <p className={styles.commentText}>
                    <span className={styles.commentUsername}>user123</span> Amazing shot! 🔥
                  </p>
                  <p className={styles.commentTime}>2h</p>
                </div>
              </div>
              <div className={styles.commentItem}>
                <div className={styles.commentAvatar}></div>
                <div>
                  <p className={styles.commentText}>
                    <span className={styles.commentUsername}>photography_lover</span> Where was this taken?
                  </p>
                  <p className={styles.commentTime}>1h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionsSection}>
            <div className={styles.actionIcons}>
              <div className={styles.leftIcons}>
                <button onClick={handleLike} className={styles.actionButton}>
                  <Heart className={selectedPost.isLiked ? styles.likedHeart : ''} /> {/* Example for conditional like styling */}
                </button>
                <button className={styles.actionButton}>
                  <MessageCircle />
                </button>
                <button className={styles.actionButton}>
                  <Send />
                </button>
              </div>
              <button className={styles.actionButton}>
                <Bookmark />
              </button>
            </div>

            <p className={styles.likesCount}>
              {selectedPost.likes.toLocaleString()} likes
            </p>

            {/* Add Comment */}
            <div className={styles.addCommentSection}>
              <input
                type="text"
                placeholder="Add a comment..."
                className={styles.commentInput}
              />
              <button className={styles.postButton}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;