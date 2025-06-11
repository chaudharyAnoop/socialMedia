import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectPost, likePost, Post } from '../../store/slices/exploreSlice';
import { Heart, MessageCircle, Play } from 'lucide-react';

// Import the CSS module
import styles from './ExploreGrid.module.css'; // Adjust path if your CSS file is elsewhere

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

  const getGridClasses = (size: string) => {
    // Dynamically apply base class and size-specific class from the CSS module
    let sizeClass = '';
    switch (size) {
      case 'large':
        sizeClass = styles.largeItem;
        break;
      case 'medium':
        sizeClass = styles.mediumItem;
        break;
      default: // 'small' or any other default
        sizeClass = styles.smallItem;
        break;
    }
    // Combine the base grid item class with the size-specific class
    return `${styles.gridItem} ${sizeClass}`;
  };

  return (
    <div className={styles.gridContainer}>
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={getGridClasses(post.size)} // Apply classes from the module
          onClick={() => handlePostClick(post)}
        >
          {/* Image */}
          <img
            src={post.imageUrl}
            alt={`Post by ${post.username}`}
            // No direct className needed here as it's targeted by .gridItem img in CSS
            loading="lazy"
          />

          {/* Video indicator */}
          {post.isVideo && (
            <div className={styles.videoIndicator}>
              <Play className={styles.videoIndicatorSvg} /> {/* Apply a specific class for the icon if needed */}
            </div>
          )}

          {/* Hover overlay */}
          <div className={styles.hoverOverlay}>
            <div className={styles.overlayContent}>
              <button
                onClick={(e) => handleLike(e, post.id)}
                className={styles.overlayButton}
              >
                <Heart className={styles.overlayButtonSvg} />
                <span className={styles.overlayButtonText}>{post.likes.toLocaleString()}</span>
              </button>
              <div className={styles.overlayButton}> {/* Reusing overlayButton style for comments */}
                <MessageCircle className={styles.overlayButtonSvg} />
                <span className={styles.overlayButtonText}>{post.comments}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreGrid;