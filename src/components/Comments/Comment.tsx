import React from "react";
import styles from "./Comment.module.css";

import { Heart, Home, MessageCircle } from "lucide-react";

function Comment() {
  const txt = `Wow, this looks amazing! 😍 Keep shining! ✨ #Inspo dashbdgb dajdas dbjasbdas dhasvdbas dbhasvd asdbva sd dbausd asjdas dbsad asdasdb asdabsd asbd asbd anbs dasd had sad `;

  return (
    <div className={styles.commentcard}>
      <p className={styles.avatar}>A</p>
      <div className={styles.commentdata}>
        <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
        <p className={styles.commentvalue}>{txt}</p>
        <div className={styles.interactions}>
          <p className={styles.commenttime}>37 min </p>
          <p className={styles.commentlikes}>337 likes </p>
          <button className={styles.replybutton}>Reply</button>
        </div>
        <div className={styles.viewReplyDiv}>
          <div className={styles.line}></div>
          <button className={styles.viewReplyButton}>View replies (12)</button>
        </div>
      </div>
      <Heart className={styles.like} />
    </div>
  );
}

export default Comment;
