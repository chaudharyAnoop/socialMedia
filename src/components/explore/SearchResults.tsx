import React from "react";
import { Heart, MessageCircle, Play, CheckCircle } from "lucide-react";

// Import the CSS module
import styles from "./SearchResults.module.css"; // Adjust path if your CSS file is elsewhere
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  likePost,
  selectPost,
  type Account,
  type Post,
} from "../../redux/slices/exploreSlice";

const SearchResults: React.FC = () => {
  const { searchResults, isSearching } = useAppSelector(
    (state) => state.explore
  );
  const dispatch = useAppDispatch();

  if (!isSearching) return null;

  const handlePostClick = (post: Post) => {
    dispatch(selectPost(post));
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    dispatch(likePost(postId));
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className={styles.searchResultsContainer}>
      {/* Accounts Section */}
      {searchResults.accounts.length > 0 && (
        <div>
          <h2 className={styles.sectionHeader}>Accounts</h2>
          <div className={styles.accountsList}>
            {searchResults.accounts.map((account: Account) => (
              <div key={account.id} className={styles.accountItem}>
                <div className={styles.profileImageContainer}>
                  <img
                    src={account.profileImage}
                    alt={account.username}
                    className={styles.profileImage}
                  />
                  {account.isVerified && (
                    <div className={styles.verifiedBadgeOuter}>
                      <CheckCircle />
                    </div>
                  )}
                </div>
                <div className={styles.accountInfo}>
                  <div className={styles.usernameContainer}>
                    <span className={styles.username}>{account.username}</span>
                    {account.isVerified && (
                      <CheckCircle className={styles.verifiedIcon} />
                    )}
                  </div>
                  <p className={styles.fullName}>{account.fullName}</p>
                  <p className={styles.followersCount}>
                    {formatFollowers(account.followers)} followers
                  </p>
                </div>
                <button className={styles.followButton}>Follow</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Section */}
      {searchResults.posts.length > 0 && (
        <div>
          <h2 className={styles.sectionHeader}>Posts</h2>
          <div className={styles.postsGrid}>
            {searchResults.posts.map((post) => (
              <div
                key={post.id}
                className={styles.postGridItem} // Base and group hover handled in CSS
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.imageUrl}
                  alt={`Post by ${post.username}`}
                  // No direct className needed here as it's targeted by .postGridItem img in CSS
                  loading="lazy"
                />

                {/* Video indicator */}
                {post.isVideo && (
                  <div className={styles.videoIndicator}>
                    <Play />
                  </div>
                )}

                {/* Hover overlay */}
                <div className={styles.hoverOverlay}>
                  <div className={styles.overlayContent}>
                    <button
                      onClick={(e) => handleLike(e, post.id)}
                      className={styles.overlayButton}
                    >
                      <Heart />
                      <span className={styles.overlayButtonSpan}>
                        {post.likes.toLocaleString()}
                      </span>
                    </button>
                    <div className={styles.overlayButton}>
                      {" "}
                      {/* Reusing overlayButton style for comments */}
                      <MessageCircle />
                      <span className={styles.overlayButtonSpan}>
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.accounts.length === 0 &&
        searchResults.posts.length === 0 && (
          <div className={styles.noResultsContainer}>
            <p className={styles.noResultsMessage}>No results found</p>
            <p className={styles.noResultsSubMessage}>
              Try searching for something else
            </p>
          </div>
        )}
    </div>
  );
};

export default SearchResults;
