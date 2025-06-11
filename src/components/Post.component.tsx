import React from "react";
import styles from "../styles/Post.module.css";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaShare,
  FaShareAlt,
} from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { BsFillSendFill, BsSend } from "react-icons/bs";
import { FaMessage, FaRegMessage } from "react-icons/fa6";

interface CircularImageProps {
  imgUrl: string;
  alt?: string;
  body: string;
}

export default function Post({ imgUrl, alt, body }: CircularImageProps) {
  return (
    <div className={styles.main}>
      <div className={styles.data}>
        <div className={styles.title}>
          <img src="/dp1.jpg" className={styles.dp}></img>
          <p className={styles.t1}>anoop kumar chaudhary</p>
        </div>
        <p className={styles.t2}>2 hours ago</p>
      </div>

      <img src={imgUrl} alt={alt} className={styles.img}></img>
      <div className={styles.likes}>
        <div className={styles.interactions}>
          <FaHeart className={styles.icon} />
          <FaRegMessage className={styles.icon} />
          <BsSend className={styles.icon} />
        </div>
        <FaRegBookmark className={styles.icon} />
      </div>
      <div className={styles.likecountdiv}>
        <p className={styles.likecount}>280043 Likes</p>
      </div>

      <p className={styles.desc}>{body}</p>
      <div className={styles.likecountdiv}>
        <p className={styles.commentcount}>View all 68 comments</p>
      </div>
      <div className={styles.inputs}>
        <input className={styles.input} placeholder="Add a comment"></input>
        <button className={styles.post}>Post</button>
      </div>
    </div>
  );
}
