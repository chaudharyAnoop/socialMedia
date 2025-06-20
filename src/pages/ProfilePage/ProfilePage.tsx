// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { fetchUserProfile } from "../../redux/slices/profileSlice";
// import styles from "./ProfilePage.module.css";

// const ProfilePage: React.FC = () => {
//   const { username } = useParams<{ username: string }>();
//   const dispatch = useAppDispatch();

//   const profile = useAppSelector((state) => state.profiles.users[username || ""]);

//   useEffect(() => {
//     if (username) dispatch(fetchUserProfile(username));
//   }, [dispatch, username]);

//   if (!profile) return <div className={styles.loading}>Loading profile...</div>;

//   return (
//     <div className={styles.profileContainer}>
//       <div className={styles.profileHeader}>
//         <img src={profile.profileImage} alt={profile.username} className={styles.profileImage} />
//         <div className={styles.userInfo}>
//           <h2 className={styles.username}>{profile.username}</h2>
//           <p className={styles.fullName}>{profile.fullName}</p>
//           <p className={styles.bio}>{profile.bio}</p>
//         </div>
//       </div>
//       <div className={styles.postsGrid}>
//         {profile.posts.map((post) => (
//           <img key={post.id} src={post.imageUrl} alt={post.id} className={styles.postImage} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
