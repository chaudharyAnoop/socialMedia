import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { likePost, selectPost } from "../../../redux/slices/exploreSlice";

import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

import styles from "./PostModal.module.css";

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
      console.log(`Submitting comment: ${comment} for post ${selectedPost.id}`);
      setComment("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const handleBookmark = () => {
    console.log(`Bookmarking post ${selectedPost.id}`);
  };

  const handleShare = () => {
    console.log(`Sharing post ${selectedPost.id}`);
  };

  const handleMoreOptions = () => {
    console.log(`More options for post ${selectedPost.id}`);
  };

  const mediaUrl = selectedPost.imageUrl;

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

        <div className={styles.contentSection}>
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

          {selectedPost.content && (
            <div className={styles.postContentSection}>
              <p className={styles.postContent}>
                <span className={styles.postUsername}>
                  {selectedPost.username}
                </span>{" "}
                {selectedPost.content}
              </p>
            </div>
          )}

          <div className={styles.commentsSection}>
            <div className={styles.commentList}>
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
                  onClick={() =>
                    console.log(`View comments for post ${selectedPost.id}`)
                  }
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

            <form
              onSubmit={handleCommentSubmit}
              className={styles.addCommentSection}
            >
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
