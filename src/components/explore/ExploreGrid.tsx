import React from "react";
import { Heart, MessageCircle, Play } from "lucide-react";

// Import the CSS module
import styles from "./ExploreGrid.module.css"; // Adjust path if your CSS file is elsewhere
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  likePost,
  selectPost,
  type Post,
} from "../../redux/slices/exploreSlice";

const ExploreGrid: React.FC = () => {
  const { posts } = useAppSelector((state) => state.explore);
  const dispatch = useAppDispatch();

  const handlePostClick = (post: Post) => {
    dispatch(selectPost(post));
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // Prevent opening the modal when liking
    dispatch(likePost(postId));
  };


  return (
    <div className={styles.gridContainer}>
      {posts.map((post) => (
        <div
          key={post.id}
          className={styles.gridItem}
          onClick={() => handlePostClick(post)}
        >
          <img
            src={post.imageUrl}
            alt={`Post by ${post.username}`}
            className={styles.postImage}
            loading="lazy"
          />

          {post.isVideo && (
            <div className={styles.videoIndicator}>
              <Play className={styles.videoIndicatorSvg} />
            </div>
          )}

          <div className={styles.hoverOverlay}>
            <div className={styles.overlayContent}>
              <button
                onClick={(e) => handleLike(e, post.id)}
                className={styles.overlayButton}
              >
                <Heart className={styles.overlayButtonSvg} />
                <span className={styles.overlayButtonText}>
                  {post.likes.toLocaleString()}
                </span>
              </button>
              <div className={styles.overlayButton}>
                <MessageCircle className={styles.overlayButtonSvg} />
                <span className={styles.overlayButtonText}>
                  {post.comments}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreGrid;
