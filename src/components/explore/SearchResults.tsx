import React from "react";
import { Heart, MessageCircle, Play, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchResults.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  likePost,
  selectPost,
  type Account,
  type Post,
} from "../../redux/slices/exploreSlice";

const SearchResults: React.FC = () => {
  const { searchResults, isSearching, isSearchingLoading, error } = useAppSelector(
    (state) => state.explore
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handlePostClick = (post: Post) => {
    dispatch(selectPost(post));
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    dispatch(likePost(postId));
  };

  const handleAccountClick = (account: Account) => {
    navigate(`/user/${account.id}`);
  };

  const handleFollow = (account: Account) => {
    // Placeholder for future followAccount thunk
    console.log(`Following account ${account.username}`);
    // Future: dispatch(followAccount(account.id));
  };

  const handlePostKeyDown = (e: React.KeyboardEvent, post: Post) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePostClick(post);
    }
  };

  const handleAccountKeyDown = (e: React.KeyboardEvent, account: Account) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAccountClick(account);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (!isSearching) return null;

  return (
    <div className={styles.searchResultsContainer} role="region" aria-label="Search Results">
      {/* Error State */}
      {error && (
        <div className={styles.errorMessage} role="alert">
          Failed to load search results. Please check your connection and try again.
        </div>
      )}

      {/* Loading State */}
      {isSearchingLoading && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Searching...</p>
        </div>
      )}

      {/* Accounts Section (limited to 5) */}
      {!isSearchingLoading && searchResults.accounts.length > 0 && (
        <div>
          <h2 className={styles.sectionHeader}>Accounts</h2>
          <div className={styles.accountsList} role="list">
            {searchResults.accounts.slice(0, 5).map((account: Account) => (
              <div
                key={account.id}
                className={styles.accountItem}
                onClick={() => handleAccountClick(account)}
                onKeyDown={(e) => handleAccountKeyDown(e, account)}
                role="button"
                tabIndex={0}
                aria-label={`View profile of ${account.username}`}
              >
                <div className={styles.profileImageContainer}>
                  <img
                    src={account.profilePicture || `https://i.pravatar.cc/150?u=${account.id}`}
                    alt={`${account.username}'s profile`}
                    className={styles.profileImage}
                    onError={() => console.error(`Failed to load profile picture for ${account.username}`)}
                  />
                  {account.isVerified && (
                    <div className={styles.verifiedBadgeOuter}>
                      <CheckCircle aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className={styles.accountInfo}>
                  <div className={styles.usernameContainer}>
                    <span className={styles.username}>{account.username}</span>
                    {account.isVerified && (
                      <CheckCircle className={styles.verifiedIcon} aria-hidden="true" />
                    )}
                  </div>
                  <p className={styles.fullName}>{account.fullName}</p>
                  <p className={styles.followersCount}>
                    {formatFollowers(account.followers)} followers
                  </p>
                </div>
                <button
                  className={styles.followButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(account);
                  }}
                  aria-label={`Follow ${account.username}`}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Section */}
      {!isSearchingLoading && searchResults.posts.length > 0 && (
        <div>
          <h2 className={styles.sectionHeader}>Posts</h2>
          <div className={styles.postsGrid} role="grid">
            {searchResults.posts.map((post: Post) => {
              const mediaUrl =
                post.media && post.media.length > 0
                  ? post.media[0]
                  : `https://picsum.photos/seed/${post.id}/500/500`;
              return (
                <div
                  key={post.id}
                  className={styles.postGridItem}
                  onClick={() => handlePostClick(post)}
                  onKeyDown={(e) => handlePostKeyDown(e, post)}
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
                      onError={() => console.error(`Failed to load video: ${mediaUrl}`)}
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={`Post by ${post.username}`}
                      className={styles.postMedia}
                      loading="lazy"
                      onError={() => console.error(`Failed to load image: ${mediaUrl}`)}
                    />
                  )}

                  {post.isVideo && (
                    <div className={styles.videoIndicator}>
                      <Play aria-hidden="true" />
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
                          className={post.isLiked ? styles.likedHeart : ""}
                          aria-hidden="true"
                        />
                        <span className={styles.overlayButtonSpan}>
                          {post.likes.toLocaleString()}
                        </span>
                      </button>
                      <div className={styles.overlayButton}>
                        <MessageCircle aria-hidden="true" />
                        <span className={styles.overlayButtonSpan}>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results Fallback */}
      {!isSearchingLoading &&
        searchResults.accounts.length === 0 &&
        searchResults.posts.length === 0 &&
        !error && (
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