import React from "react";
import styles from "../styles/LandingPag.module.css";
import Post from "./Post.component";

export default function LandingPageOne() {
  return (
    <div className={styles.main}>
      <div className={styles.tags}>
        <p className={styles.t1}>Posts</p>
        <div className={styles.names}>
          <p className={styles.t2}>For you</p>
          <p className={styles.t3}>Following</p>
        </div>
      </div>
      <div className={styles.posts}>
        <Post imgUrl="/dp1.jpg" />
        <Post imgUrl="https://www.traveltrademaldives.com/assets/2019/05/nojioj.jpg" />
        <Post imgUrl="/pro.jpg" />
        <Post imgUrl="https://english.cdn.zeenews.com/sites/default/files/2022/05/31/1048479-galleryrohitvacationlead.jpg" />
        <Post imgUrl="https://www.livemint.com/lm-img/img/2024/04/28/original/MS_Dhoni_1714297900339.jpg" />
        <Post imgUrl="https://assets.sportsboom.com/Rohit_Sharma_of_India_l_celebrates_his_century_with_MS_Dhoni_0d32786d46.jpg" />
      </div>
    </div>
  );
}
