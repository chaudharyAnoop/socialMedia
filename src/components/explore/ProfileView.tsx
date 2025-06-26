import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../redux/store";
import { fetchSearchResults, Post, Account } from "../../redux/slices/exploreSlice";
import styles from './ProfileView.module.css';


interface ExtendedAccount extends Account {
  bio?: string;
  following?: number;
}

const ProfileView: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchResults, isSearchingLoading, error } = useSelector((state: RootState) => state.explore);
  const currentUser = localStorage.getItem('instagram_user')?.replace(/"/g, '');
  const isOwnProfile = username && currentUser ? username.toLowerCase() === currentUser.toLowerCase() : false;

  const [userProfile, setUserProfile] = useState<ExtendedAccount | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (username) {
      console.log('Fetching search results for username:', username);
      setIsPostsLoading(true);
      dispatch(fetchSearchResults(username));
    }
  }, [username, dispatch]);

  useEffect(() => {
    // Filter search results to find the specific user's profile (case-insensitive)
    const profile = searchResults.accounts.find(acc => acc.username.toLowerCase() === username?.toLowerCase());

    // Deduplicate posts by id and filter by username (case-insensitive)
    const uniquePosts = Array.from(
      new Map(searchResults.posts
        .filter(post => post.username.toLowerCase() === username?.toLowerCase())
        .map(post => [post.id, post])).values()
    );

    // Log for debugging duplicates
    const postIds = searchResults.posts.map(post => post.id);
    const duplicateIds = postIds.filter((id, index) => postIds.indexOf(id) !== index);
    console.log('All posts in searchResults:', searchResults.posts);
    console.log('Duplicate post IDs:', duplicateIds);
    console.log('Profile found:', profile);
    console.log('Unique posts for user:', uniquePosts);

    // Set profile with defaults
    if (profile) {
      setUserProfile({
        ...profile,
        bio: profile.bio || 'No bio available',
        following: profile.following || 0,
        profilePicture: profile.profilePicture || `https://i.pravatar.cc/150?u=${profile.id}`,
      });
    } else {
      setUserProfile(null);
    }
    setUserPosts(uniquePosts);
    setIsPostsLoading(false);
  }, [searchResults, username]);

  const handleFollow = () => {
    console.log(`Follow/unfollow ${username}`);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`);
  };

  if (isSearchingLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error || !userProfile) {
    console.error('Error or no profile:', { error, userProfile });
    return <div className={styles.error}>{error || 'User not found'}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.profileHeader}>
        <img
          src={userProfile.profilePicture}
          alt={`${userProfile.username}'s profile`}
          className={styles.profilePicture}
          onError={(e) => {
            console.error(`Failed to load profile picture for ${userProfile.username}`);
            e.currentTarget.src = `https://i.pravatar.cc/150?u=${userProfile.id}`;
          }}
        />
        <div className={styles.profileInfo}>
          <div className={styles.profileTop}>
            <h1 className={styles.username}>{userProfile.username}</h1>
            {isOwnProfile ? (
              <button className={styles.editButton} onClick={handleEditProfile}>
                Edit Profile
              </button>
            ) : (
              <button className={styles.followButton} onClick={handleFollow}>
                Follow
              </button>
            )}
          </div>
          <div className={styles.stats}>
            <span><strong>{userPosts.length}</strong> posts</span>
            <span><strong>{userProfile.followers}</strong> followers</span>
            <span><strong>{userProfile.following}</strong> following</span>
          </div>
          <div className={styles.bio}>
            <h2>{userProfile.fullName}</h2>
            <p>{userProfile.bio}</p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className={styles.postsGrid}>
        {isPostsLoading ? (
          <div className={styles.loading}>Loading posts...</div>
        ) : userPosts.length > 0 ? (
          userPosts.map(post => (
            <div key={post.id} className={styles.postContainer} onClick={() => handlePostClick(post)}>
              {post.isVideo ? (
                <video className={styles.postMedia} muted playsInline>
                  <source src={post.imageUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={post.imageUrl}
                  alt={`Post by ${post.username}`}
                  className={styles.postMedia}
                  loading="lazy"
                  onError={(e) => {
                    console.error(`Failed to load post media: ${post.imageUrl}`);
                    e.currentTarget.src = `https://picsum.photos/seed/${post.id}/500/500`;
                  }}
                />
              )}
              <div className={styles.postOverlay}>
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noPosts}>No posts yet</div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;