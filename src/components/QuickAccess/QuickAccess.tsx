import React from "react";
import styles from "./QuickAccess.module.css";

function QuickAccess() {
  return (
    <div className={styles.main}>
      <div className={styles.heading}>
        <p className={styles.head}>Notifications</p>
        <p className={styles.val}>8</p>
      </div>
      <div className={styles.nots}>
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>
      </div>
      <div className={styles.heading}>
        <p className={styles.head}>Messages</p>
        <p className={styles.val}>15</p>
      </div>
      <div className={styles.nots}>
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>{" "}
        <p className={styles.not}>
          {`Mike Brown commented on your post: 'Great job on this!`}
        </p>
      </div>
    </div>
  );
}

export default QuickAccess;
