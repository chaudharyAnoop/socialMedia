import React, { useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  likePost,
  selectPost,
  fetchFeedPosts,
} from "../../../redux/slices/exploreSlice";

import { Heart, MessageCircle, Play } from "lucide-react";

import styles from "./ExploreGrid.module.css";
import { Post } from "../../../interfaces/explore.interface";

const ExploreGrid: React.FC = () => {
  const { posts, isLoading, hasMore, page, error } = useAppSelector(
    (state) => state.explore
  );
  const dispatch = useAppDispatch();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchFeedPosts(page));
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, dispatch]
  );

  const handlePostClick = (post: Post) => {
    dispatch(selectPost(post));
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    dispatch(likePost(postId));
  };

  const handleKeyDown = (e: React.KeyboardEvent, post: Post) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePostClick(post);
    }
  };

  return (
    <div className={styles.gridWrapper} role="grid" aria-label="Explore Posts">
      {error && (
        <div className={styles.errorMessage} role="alert">
          Error: {error}
        </div>
      )}
      {posts.length === 0 && !isLoading && !error && (
        <div className={styles.noPostsMessage}>
          No posts available. Try refreshing.
        </div>
      )}
      <div className={styles.gridContainer}>
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;

          const mediaUrl = post.imageUrl;

          return (
            <div
              key={post.id}
              ref={isLast ? lastPostRef : null}
              className={styles.gridItem}
              onClick={() => handlePostClick(post)}
              onKeyDown={(e) => handleKeyDown(e, post)}
              role="gridcell"
              tabIndex={0}
              aria-label={`View post by ${post.username}`}
            >
              {post.isVideo ? (
                <video
                  src={mediaUrl}
                  className={styles.postMedia}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Video post"
                  onError={() =>
                    console.error(`Failed to load video: ${mediaUrl}`)
                  }
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={`Post by ${post.username}`}
                  className={styles.postMedia}
                  loading="lazy"
                  onError={() =>
                    console.error(`Failed to load image: ${mediaUrl}`)
                  }
                />
              )}

              {post.isVideo && (
                <div className={styles.videoIndicator}>
                  <Play
                    className={styles.videoIndicatorSvg}
                    aria-hidden="true"
                  />
                </div>
              )}

              {post.content && (
                <div className={styles.contentOverlay}>
                  <p className={styles.postContent}>{post.content}</p>
                </div>
              )}

              <div className={styles.hoverOverlay}>
                <div className={styles.overlayContent}>
                  <button
                    onClick={(e) => handleLike(e, post.id)}
                    className={styles.overlayButton}
                    aria-label={`Like post by ${post.username}`}
                  >
                    <Heart
                      className={`${styles.overlayButtonSvg} ${
                        post.isLiked ? styles.likedHeart : ""
                      }`}
                      aria-hidden="true"
                    />
                    <span className={styles.overlayButtonText}>
                      {post.likes.toLocaleString()}
                    </span>
                  </button>
                  <div className={styles.overlayButton}>
                    <MessageCircle
                      className={styles.overlayButtonSvg}
                      aria-hidden="true"
                    />
                    <span className={styles.overlayButtonText}>
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isLoading && (
        <div className={styles.loadingMessage} role="status">
          Loading...
        </div>
      )}
    </div>
  );
};

export default ExploreGrid;
