// import React, { useEffect } from "react";
// import styles from "../styles/LandingPag.module.css";
// import Post from "./Post.component";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../redux/store";
// import { fetchPosts } from "../redux/postSlice";

// export default function LandingPageOne() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { posts, status, error } = useSelector(
//     (state: RootState) => state.posts
//   );

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchPosts());
//     }
//   }, [status, dispatch]);

//   return (
//     <div className={styles.main}>
//       <div className={styles.tags}>
//         <p className={styles.t1}>Posts</p>
//         <div className={styles.names}>
//           <p className={styles.t2}>For you</p>
//           <p className={styles.t3}>Following</p>
//         </div>
//       </div>
//       {/* <h1 className={styles.title}>Social Media Feed</h1> */}
//       {status === "loading" && <div className={styles.loading}>Loading...</div>}
//       {error && <div className={styles.error}>Error: {error}</div>}
//       <div className={styles.posts}>
//         {posts.map((post) => (
//           <Post
//             // key={post.id}
//             imgUrl={`https://picsum.photos/600/400?random=${post.id}`}
//             // alt={post.title}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
