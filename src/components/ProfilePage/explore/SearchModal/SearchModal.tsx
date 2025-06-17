// components/SearchModal/SearchModal.tsx - Search Users and Posts

import React, { useState } from 'react';
import { X, Search, User, MapPin } from 'lucide-react';
import { usePosts, useProfile } from '../../../../../../../igdummy/src/contexts/AppContext';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { posts } = usePosts();
  const { currentUser } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');

  // Simple search functionality
  const filteredPosts = posts.filter(post => 
    post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock users for search results
  const searchUsers = searchQuery ? [
    {
      id: '1',
      username: 'adventure_seeker',
      fullName: 'Alex Adventure',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      isVerified: true,
      followers: 12543,
    },
    {
      id: '2',
      username: 'photo_lover',
      fullName: 'Photography Enthusiast',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      isVerified: false,
      followers: 8921,
    }
  ].filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const hasResults = filteredPosts.length > 0 || searchUsers.length > 0;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, users, locations..."
              className={styles.searchInput}
              autoFocus
            />
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('posts')}
            className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
          >
            Posts ({filteredPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          >
            Users ({searchUsers.length})
          </button>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {!searchQuery ? (
            <div className={styles.emptyState}>
              <Search className={styles.emptyIcon} />
              <p className={styles.emptyText}>Start typing to search...</p>
            </div>
          ) : !hasResults ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <>
              {activeTab === 'posts' && (
                <div className={styles.postsGrid}>
                  {filteredPosts.map((post) => (
                    <div key={post.id} className={styles.postItem}>
                      <img
                        src={post.isCarousel && post.media ? post.media[0].url : post.imageUrl}
                        alt="Post"
                        className={styles.postImage}
                      />
                      {post.isCarousel && (
                        <div className={styles.carouselIndicator}>
                          <div className={styles.carouselIcon} />
                        </div>
                      )}
                      <div className={styles.postOverlay}>
                        <div className={styles.postStats}>
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'users' && (
                <div className={styles.usersList}>
                  {searchUsers.map((user) => (
                    <div key={user.id} className={styles.userItem}>
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className={styles.userAvatar}
                      />
                      <div className={styles.userInfo}>
                        <div className={styles.userDetails}>
                          <span className={styles.username}>
                            {user.username}
                            {user.isVerified && (
                              <span className={styles.verified}>✓</span>
                            )}
                          </span>
                          <span className={styles.fullName}>{user.fullName}</span>
                          <span className={styles.followers}>
                            {user.followers.toLocaleString()} followers
                          </span>
                        </div>
                        <button className={styles.followButton}>
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};