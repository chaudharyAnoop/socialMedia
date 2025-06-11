import React from "react";
import styles from "../styles/Post.module.css";
import { FaBookmark, FaHeart, FaRegBookmark } from "react-icons/fa";
import { FaMessage, FaRegMessage } from "react-icons/fa6";

interface CircularImageProps {
  imgUrl: string;
  alt?: string;
}

export default function Post({ imgUrl, alt }: CircularImageProps) {
  return (
    <div className={styles.main}>
      <div className={styles.data}>
        <div className={styles.title}>
          <img src="/dp1.jpg" className={styles.dp}></img>
          <p className={styles.t1}>anoop kumar chaudhary</p>
        </div>
        <p className={styles.t2}>2 hours ago</p>
      </div>

      <img src={imgUrl} className={styles.img}></img>
      <div className={styles.likes}>
        <div>
          <FaHeart className={styles.icon} />
          <FaRegMessage className={styles.icon} />
        </div>
        <FaRegBookmark className={styles.icon} />
      </div>
      <p className={styles.desc}>
        {`Indian cricket captain Rohit Sharma is enjoying a family vacation in the
        Maldives, spending quality time with his wife Ritika Sajdeh and daughter
        Samaira. Embracing his role as a doting father, Rohit has been seen
        indulging in fun beach activities and relaxing amidst the scenic beauty
        of the islands.`}
      </p>
    </div>
  );
}
