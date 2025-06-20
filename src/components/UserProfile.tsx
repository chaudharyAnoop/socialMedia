import React, { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import {
  searchUsers,
  clearSearchResults,
  UserSearchState,
  User,
} from "../redux/UserProfile";
import styles from "../styles/UserProfile.module.css";

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, status, error, totalCount } = useSelector<
    RootState,
    UserSearchState
  >((state) => state.userSearch);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchUsers({ query: searchTerm }));
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    dispatch(clearSearchResults());
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term..."
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.searchButton}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
        >
          Clear
        </button>
      </form>

      {error && <div className={styles.error}>Error: {error}</div>}

      {status === "loading" && <div className={styles.loading}>Loading...</div>}

      {status === "succeeded" && users.length === 0 && (
        <div className={styles.noResults}>No users found.</div>
      )}

      {status === "succeeded" && users.length > 0 && (
        <div>
          <p className={styles.resultsInfo}>
            Found {users.length} of {totalCount} users
          </p>
          <div className={styles.userGrid}>
            {users.map((user: User) => (
              <div
                key={user._id}
                className={styles.userCard}
                onClick={() => handleUserClick(user._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleUserClick(user._id)
                }
              >
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt={`${user.username}'s profile`}
                    className={styles.profilePicture}
                  />
                )}
                <h2 className={styles.userName}>
                  {user.fullName || user.username}
                </h2>
                <p className={styles.userUsername}>@{user.username}</p>
                <p className={styles.userEmail}>{user.email}</p>
                {user.bio && <p className={styles.userBio}>{user.bio}</p>}
                <div className={styles.userStats}>
                  <span>{user.followersCount} Followers</span>
                  <span>{user.followingCount} Following</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
