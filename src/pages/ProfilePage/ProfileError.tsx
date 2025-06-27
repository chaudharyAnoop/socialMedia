import React from "react";
import styles from "./ProfileError.module.css";

interface ProfileErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const ProfileError: React.FC<ProfileErrorProps> = ({
  errorMessage,
  onRetry,
}) => (
  <div className={styles.container}>
    <div className={styles.errorState}>
      <div className={styles.emptyIcon}>⚠️</div>
      <h3>Something went wrong</h3>
      <p>{errorMessage}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        Try Again
      </button>
    </div>
  </div>
);

export default ProfileError;
