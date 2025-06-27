import React from "react";
import styles from "./ProfileLoading.module.css";

const ProfileLoading: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading profile...</p>
    </div>
  </div>
);

export default ProfileLoading;
