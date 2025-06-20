// ProfilePage.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import the typed useAppDispatch
import { fetchUser, clearUser } from '../redux/userProfile'; // Adjust the path to your userSlice
import styles from '../styles/profilePage.module.css';
import { useAppDispatch } from '../redux/hooks';

// Define the User interface (matching the Redux slice)
interface User {
  _id: string;
  username: string;
  email: string;
  accountType: string;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  posts: string[];
  blockedUsers: string[];
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  emailVerified: boolean;
  isActive: boolean;
  isPrivate: boolean;
  pendingFollowRequests: string[];
  sessions: string[];
  status: string;
}

// Define the UserState interface (matching the Redux slice)
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const ProfilePageUser: React.FC = () => {
  const dispatch = useAppDispatch(); // Use the typed dispatch
  const { user, loading, error } = useSelector((state: { user: UserState }) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>No user data available</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          <div className={styles.avatarPlaceholder}>{user.username[0].toUpperCase()}</div>
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.usernameRow}>
            <h1 className={styles.username}>{user.username}</h1>
            <button className={styles.editButton}>Edit Profile</button>
          </div>
          <div className={styles.stats}>
            <span><strong>{user.posts.length}</strong> posts</span>
            <span><strong>{user.followersCount}</strong> followers</span>
            <span><strong>{user.followingCount}</strong> following</span>
          </div>
          <div className={styles.accountDetails}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Account Type:</strong> {user.accountType}</p>
            <p><strong>Private:</strong> {user.isPrivate ? 'Yes' : 'No'}</p>
            <p><strong>Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <div className={styles.postsSection}>
        <h2>Posts</h2>
        {user.posts.length === 0 ? (
          <p className={styles.noPosts}>No posts yet</p>
        ) : (
          <div className={styles.postsGrid}>
            {user.posts.map((postId) => (
              <div key={postId} className={styles.postPlaceholder}>
                Post {postId}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={styles.logoutButton}
        onClick={() => dispatch(clearUser())}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePageUser;