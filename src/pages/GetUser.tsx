import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import { fetchUser, clearUser, UserState, User } from "../redux/GetUser";
import styles from "../styles/GetUser.module.css";

const GetUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams<{ userId: string }>();
  const { user, status, error } = useSelector<RootState, UserState>(
    (state) => state.user
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
    }
    return () => {
      dispatch(clearUser());
    };
  }, [dispatch, userId]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!user) {
    return <div className={styles.noUser}>User not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {user.fullName || user.username}'s Profile
      </h1>
      <div className={styles.userCard}>
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt='{${user.username}profile}'
            className={styles.profilePicture}
          />
        )}
        <h2 className={styles.userName}>{user.fullName || user.username}</h2>
        <p className={styles.userUsername}>@{user.username}</p>
        <p className={styles.userEmail}>{user.email}</p>
        {user.bio && <p className={styles.userBio}>{user.bio}</p>}
        <div className={styles.userStats}>
          <span>{user.followersCount} Followers</span>
          <span>{user.followingCount} Following</span>
        </div>
        <div className={styles.userDetails}>
          <p>Account Type: {user.accountType}</p>
          <p>Status: {user.status}</p>
          <p>Email Verified: {user.emailVerified ? "Yes" : "No"}</p>
          <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
          {user.isBanned && user.banReason && (
            <p>Ban Reason: {user.banReason}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetUser;