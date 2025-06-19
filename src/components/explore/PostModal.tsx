import React, { useState } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import styles from "./PostModal.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { likePost, selectPost, type Post } from "../../redux/slices/exploreSlice";

const PostModal: React.FC = () => {
  const { selectedPost } = useAppSelector((state) => state.explore);
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState("");

  if (!selectedPost) return null;

  const handleClose = () => {
    dispatch(selectPost(null));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleLike = () => {
    dispatch(likePost(selectedPost.id));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Placeholder for future postComment thunk
      console.log(`Submitting comment: ${comment} for post ${selectedPost.id}`);
      setComment("");
      // Future: dispatch(postComment({ postId: selectedPost.id, comment }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const handleBookmark = () => {
    // Placeholder for future savePost thunk
    console.log(`Bookmarking post ${selectedPost.id}`);
    // Future: dispatch(savePost(selectedPost.id));
  };

  const handleShare = () => {
    // Placeholder for future sharePost thunk
    console.log(`Sharing post ${selectedPost.id}`);
    // Future: dispatch(sharePost(selectedPost.id));
  };

  const handleMoreOptions = () => {
    // Placeholder for future more options action
    console.log(`More options for post ${selectedPost.id}`);
  };

  // Use the first media URL if available, otherwise fallback to a placeholder
  const mediaUrl =
    selectedPost.media && selectedPost.media.length > 0
      ? selectedPost.media[0]
      : `https://picsum.photos/seed/${selectedPost.id}/600/600`;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-label="Post Modal"
      tabIndex={0}
    >
      <div className={styles.modalContent}>
        {/* Media Section */}
        <div className={styles.mediaSection}>
          {selectedPost.isVideo ? (
            <video
              src={mediaUrl}
              className={styles.postMedia}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-label="Video post"
              onError={() => console.error(`Failed to load video: ${mediaUrl}`)}
            />
          ) : (
            <img
              src={mediaUrl}
              alt={`Post by ${selectedPost.username}`}
              className={styles.postMedia}
              onError={() => console.error(`Failed to load image: ${mediaUrl}`)}
            />
          )}
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
              <button
                className={styles.headerButton}
                onClick={handleMoreOptions}
                aria-label="More options"
              >
                <MoreHorizontal />
              </button>
              <button
                className={styles.headerButton}
                onClick={handleClose}
                aria-label="Close modal"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Post Content */}
          {selectedPost.content && (
            <div className={styles.postContentSection}>
              <p className={styles.postContent}>
                <span className={styles.postUsername}>{selectedPost.username}</span>{" "}
                {selectedPost.content}
              </p>
            </div>
          )}

          {/* Comments Section (Placeholder) */}
          <div className={styles.commentsSection}>
            <div className={styles.commentList}>
              {/* Static placeholder comments; replace with dynamic data when available */}
              <div className={styles.commentItem}>
                <div className={styles.commentAvatar}></div>
                <div>
                  <p className={styles.commentText}>
                    <span className={styles.commentUsername}>user123</span>{" "}
                    Amazing shot! 🔥
                  </p>
                  <p className={styles.commentTime}>2h</p>
                </div>
              </div>
              <div className={styles.commentItem}>
                <div className={styles.commentAvatar}></div>
                <div>
                  <p className={styles.commentText}>
                    <span className={styles.commentUsername}>
                      photography_lover
                    </span>{" "}
                    Where was this taken?
                  </p>
                  <p className={styles.commentTime}>1h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsSection}>
            <div className={styles.actionIcons}>
              <div className={styles.leftIcons}>
                <button
                  onClick={handleLike}
                  className={styles.actionButton}
                  aria-label={`Like post by ${selectedPost.username}`}
                >
                  <Heart
                    className={selectedPost.isLiked ? styles.likedHeart : ""}
                    aria-hidden="true"
                  />
                </button>
                <button
                  className={styles.actionButton}
                  aria-label="View comments"
                  onClick={() => console.log(`View comments for post ${selectedPost.id}`)}
                >
                  <MessageCircle aria-hidden="true" />
                </button>
                <button
                  className={styles.actionButton}
                  aria-label="Share post"
                  onClick={handleShare}
                >
                  <Send aria-hidden="true" />
                </button>
              </div>
              <button
                className={styles.actionButton}
                aria-label="Bookmark post"
                onClick={handleBookmark}
              >
                <Bookmark aria-hidden="true" />
              </button>
            </div>

            <p className={styles.likesCount}>
              {selectedPost.likes.toLocaleString()} likes
            </p>

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className={styles.addCommentSection}>
              <input
                type="text"
                placeholder="Add a comment..."
                className={styles.commentInput}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                aria-label="Add a comment"
              />
              <button
                type="submit"
                className={styles.postButton}
                disabled={!comment.trim()}
                aria-label="Post comment"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;