// import React, { useState } from "react";
// import styles from "../styles/Post.module.css";
// import { FaHeart, FaRegBookmark, FaTimes } from "react-icons/fa";
// import { BsSend } from "react-icons/bs";
// import { FaRegMessage } from "react-icons/fa6";
// import { MessageCircle, Send } from "lucide-react";
// import Comment from "./Comments/Comment";

// interface CircularImageProps {
//   imgUrl: string;
//   alt?: string;
//   body: string;
//   title: string;
//   likecount: string;
// }

// export default function Post({
//   imgUrl,
//   alt,
//   body,
//   title,
//   likecount,
// }: CircularImageProps) {
//   const txt = `Wow, this looks amazing! 😍 Keep shining! ✨ #Inspo dashbdgb dajdas dbjasbdas dhasvdbas dbhasvd asdbva sd dbausd asjdas dbsad asdasdb asdabsd asbd asbd anbs dasd had sad `;
//   const [isOpen, setIsOpen] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//   };

//   // Handle image load error
//   const handleImageError = () => {
//     setIsImageLoading(false); // Optionally handle error state
//     console.error("Failed to load image");
//   };
//   return (
//     <div className={styles.main}>
//       <div className={styles.data}>
//         <div className={styles.title}>
//           <img src="/dp1.jpg" className={styles.dp}></img>
//           <p className={styles.t1}>{title}</p>
//         </div>
//         <p className={styles.t2}>2 hours ago</p>
//       </div>

//       {isImageLoading && (
//         <div className={styles.loadingSpinner}>
//           <div className={styles.spinner}></div>
//         </div>
//       )}
//       <img
//         src={imgUrl}
//         alt={alt}
//         className={`${styles.img} ${isImageLoading ? styles.hidden : ""}`}
//         onLoad={handleImageLoad}
//         onError={handleImageError}
//       />
//       <div className={styles.likes}>
//         <div className={styles.interactions}>
//           <FaHeart className={styles.icon} />
//           <MessageCircle className={styles.icon} />
//           <Send className={styles.icon} />
//         </div>
//         <FaRegBookmark className={styles.icon} />
//       </div>
//       <div className={styles.likecountdiv}>
//         <p className={styles.likecount}>{likecount} Likes</p>
//       </div>

//       <p className={styles.desc}>{body}</p>
//       <div className={styles.likecountdiv}>
//         <p
//           className={styles.commentcount}
//           onClick={() => {
//             setIsOpen(!isOpen);
//           }}
//         >
//           View all 68 comments
//         </p>
//       </div>
//       <div className={styles.inputs}>
//         <input className={styles.input} placeholder="Add a comment"></input>
//         <button className={styles.post}>Post</button>
//       </div>
//       {isOpen && (
//         <div className={styles.main_comments}>
//           <div className={styles.close}>
//             <FaTimes
//               className={styles.closeicon}
//               onClick={() => {
//                 setIsOpen(!isOpen);
//               }}
//             />
//           </div>
//           <div className={styles.comment_div}>
//             <div className={styles.comment_img}>
//               <img
//                 src={imgUrl}
//                 alt={alt}
//                 className={styles.commentimg}
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//               />
//             </div>
//             <div className={styles.comments}>
//               {" "}
//               <div className={styles.data}>
//                 <div className={styles.title}>
//                   <img src="/dp1.jpg" className={styles.dp}></img>
//                   <p className={styles.t1}>{title}</p>
//                 </div>
//                 <p className={styles.t2}>2 hours ago</p>
//               </div>
//               <div className={styles.allcomments}>
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//               </div>{" "}
//               <div className={styles.likes}>
//                 <div className={styles.interactions}>
//                   <FaHeart className={styles.icon} />
//                   <MessageCircle className={styles.icon} />
//                   <Send className={styles.icon} />
//                 </div>
//                 <FaRegBookmark className={styles.icon} />
//               </div>
//               <div className={styles.inputs}>
//                 <input
//                   className={styles.input2}
//                   placeholder="Post a comment"
//                 ></input>
//                 <button className={styles.post_button}>Post</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import styles from "../styles/Post.module.css";
// import { FaHeart, FaRegBookmark, FaTimes } from "react-icons/fa";
// import { BsSend } from "react-icons/bs";
// import { MessageCircle, Send } from "lucide-react";
// import {
//   fetchComments,
//   addComment,
//   likeComment,
//   replyComment,
//   resetComments,
//   type CommentsState,
// } from "../redux/commentSlice"; // Adjust path as needed

// interface CircularImageProps {
//   imgUrl: string;
//   alt?: string;
//   body: string;
//   title: string;
//   likecount: string;
//   postId: string; // Added to identify the post for comments
// }

// interface CommentProps {
//   id: string;
//   postId: string;
//   user: string;
//   content: string;
//   createdAt: string;
//   likes?: number;
//   replies?: CommentProps[];
// }

// export default function Post({
//   imgUrl,
//   alt,
//   body,
//   title,
//   likecount,
//   postId,
// }: CircularImageProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const [commentInput, setCommentInput] = useState("");
//   const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
//   const dispatch = useDispatch();
//   const { comments, status, error } = useSelector(
//     (state: { comments: CommentsState }) => state.comments
//   );

//   useEffect(() => {
//     if (isOpen) {
//       dispatch(fetchComments(postId));
//     } else {
//       dispatch(resetComments());
//     }
//   }, [isOpen, dispatch, postId]);

//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//   };

//   const handleImageError = () => {
//     setIsImageLoading(false);
//     console.error("Failed to load image");
//   };

//   const handleAddComment = () => {
//     if (commentInput.trim()) {
//       dispatch(addComment({ postId, content: commentInput }));
//       setCommentInput("");
//     }
//   };

//   const handleLikeComment = (commentId: string) => {
//     dispatch(likeComment(commentId));
//   };

//   const handleReplyComment = (commentId: string) => {
//     const replyContent = replyInputs[commentId]?.trim();
//     if (replyContent) {
//       dispatch(replyComment({ commentId, content: replyContent }));
//       setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
//     }
//   };

//   const handleReplyInputChange = (commentId: string, value: string) => {
//     setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
//   };

//   const renderComment = (comment: CommentProps, depth = 0) => {
//     return (
//       <div key={comment.id} className={styles.comment}>
//         <div className={styles.commentHeader}>
//           <img src="/dp1.jpg" className={styles.dp} />
//           <div>
//             <p className={styles.t1}>{comment.user}</p>
//             <p className={styles.t2}>
//               {new Date(comment.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>
//         <p className={styles.commentContent}>{comment.content}</p>
//         <div className={styles.commentActions}>
//           <button onClick={() => handleLikeComment(comment.id)}>
//             <FaHeart /> {comment.likes || 0}
//           </button>
//           <button
//             onClick={() =>
//               setReplyInputs((prev) => ({
//                 ...prev,
//                 [comment.id]: prev[comment.id] || "",
//               }))
//             }
//           >
//             Reply
//           </button>
//         </div>
//         {replyInputs[comment.id] !== undefined && (
//           <div className={styles.replyInput}>
//             <input
//               value={replyInputs[comment.id] || ""}
//               onChange={(e) =>
//                 handleReplyInputChange(comment.id, e.target.value)
//               }
//               placeholder="Write a reply..."
//               className={styles.input}
//             />
//             <button
//               onClick={() => handleReplyComment(comment.id)}
//               className={styles.post_button}
//             >
//               Reply
//             </button>
//           </div>
//         )}
//         {comment.replies?.map((reply) => (
//           <div key={reply.id} className={styles.reply}>
//             {renderComment(reply, depth + 1)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className={styles.main}>
//       <div className={styles.data}>
//         <div className={styles.title}>
//           <img src="/dp1.jpg" className={styles.dp} />
//           <p className={styles.t1}>{title}</p>
//         </div>
//         <p className={styles.t2}>2 hours ago</p>
//       </div>

//       {isImageLoading && (
//         <div className={styles.loadingSpinner}>
//           <div className={styles.spinner}></div>
//         </div>
//       )}
//       <img
//         src={imgUrl}
//         alt={alt}
//         className={`${styles.img} ${isImageLoading ? styles.hidden : ""}`}
//         onLoad={handleImageLoad}
//         onError={handleImageError}
//       />
//       <div className={styles.likes}>
//         <div className={styles.interactions}>
//           <FaHeart className={styles.icon} />
//           <MessageCircle className={styles.icon} />
//           <Send className={styles.icon} />
//         </div>
//         <FaRegBookmark className={styles.icon} />
//       </div>
//       <div className={styles.likecountdiv}>
//         <p className={styles.likecount}>{likecount} Likes</p>
//       </div>

//       <p className={styles.desc}>{body}</p>
//       <div className={styles.likecountdiv}>
//         <p
//           className={styles.commentcount}
//           onClick={() => {
//             setIsOpen(!isOpen);
//           }}
//         >
//           View all {comments.length} comments
//         </p>
//       </div>
//       <div className={styles.inputs}>
//         <input
//           className={styles.input}
//           placeholder="Add a comment"
//           value={commentInput}
//           onChange={(e) => setCommentInput(e.target.value)}
//         />
//         <button className={styles.post} onClick={handleAddComment}>
//           Post
//         </button>
//       </div>
//       {isOpen && (
//         <div className={styles.main_comments}>
//           <div className={styles.close}>
//             <FaTimes
//               className={styles.closeicon}
//               onClick={() => {
//                 setIsOpen(!isOpen);
//               }}
//             />
//           </div>
//           <div className={styles.comment_div}>
//             <div className={styles.comment_img}>
//               <img
//                 src={imgUrl}
//                 alt={alt}
//                 className={styles.commentimg}
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//               />
//             </div>
//             <div className={styles.comments}>
//               <div className={styles.data}>
//                 <div className={styles.title}>
//                   <img src="/dp1.jpg" className={styles.dp} />
//                   <p className={styles.t1}>{title}</p>
//                 </div>
//                 <p className={styles.t2}>2 hours ago</p>
//               </div>
//               <div className={styles.allcomments}>
//                 {status === "loading" && <p>Loading comments...</p>}
//                 {status === "failed" && <p>Error: {error}</p>}
//                 {status === "succeeded" &&
//                   comments.map((comment) => renderComment(comment))}
//               </div>
//               <div className={styles.likes}>
//                 <div className={styles.interactions}>
//                   <FaHeart className={styles.icon} />
//                   <MessageCircle className={styles.icon} />
//                   <Send className={styles.icon} />
//                 </div>
//                 <FaRegBookmark className={styles.icon} />
//               </div>
//               <div className={styles.inputs}>
//                 <input
//                   className={styles.input2}
//                   placeholder="Post a comment"
//                   value={commentInput}
//                   onChange={(e) => setCommentInput(e.target.value)}
//                 />
//                 <button
//                   className={styles.post_button}
//                   onClick={handleAddComment}
//                 >
//                   Post
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux"; // Adjust path to your store
// import styles from "../styles/Post.module.css";
// import { FaHeart, FaRegBookmark, FaTimes } from "react-icons/fa";
// import { MessageCircle, Send } from "lucide-react";
// import {
//   fetchComments,
//   addComment,
//   likeComment,
//   replyComment,
//   resetComments,
//   type Comment,
// } from "../redux/commentSlice"; // Adjust path to your slice
// import type { AppDispatch, RootState } from "../redux/store";

// interface CircularImageProps {
//   imgUrl: string;
//   alt?: string;
//   body: string;
//   title: string;
//   likecount: string;
//   postId: string;
// }

// export default function Post({
//   imgUrl,
//   alt,
//   body,
//   title,
//   likecount,
//   postId,
// }: CircularImageProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const [commentInput, setCommentInput] = useState("");
//   const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
//   const dispatch = useDispatch<AppDispatch>();
//   const { comments, status, error } = useSelector(
//     (state: RootState) => state.comments
//   );

//   useEffect(() => {
//     if (isOpen) {
//       dispatch(fetchComments(postId));
//     } else {
//       dispatch(resetComments());
//     }
//   }, [isOpen, dispatch, postId]);

//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//   };

//   const handleImageError = () => {
//     setIsImageLoading(false);
//     console.error("Failed to load image");
//   };

//   const handleAddComment = () => {
//     if (commentInput.trim()) {
//       dispatch(addComment({ postId, content: commentInput }));
//       setCommentInput("");
//     }
//   };

//   const handleLikeComment = (commentId: string) => {
//     dispatch(likeComment(commentId));
//   };

//   const handleReplyComment = (commentId: string) => {
//     const replyContent = replyInputs[commentId]?.trim();
//     if (replyContent) {
//       dispatch(replyComment({ commentId, content: replyContent }));
//       setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
//     }
//   };

//   const handleReplyInputChange = (commentId: string, value: string) => {
//     setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
//   };

//   const renderComment = (comment: Comment, depth = 0) => {
//     return (
//       <div key={comment.id} className={styles.comment}>
//         <div className={styles.commentHeader}>
//           <img src="/dp1.jpg" className={styles.dp} />
//           <div>
//             <p className={styles.t1}>{comment.user}</p>
//             <p className={styles.t2}>
//               {new Date(comment.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>
//         <p className={styles.commentContent}>{comment.content}</p>
//         <div className={styles.commentActions}>
//           <button onClick={() => handleLikeComment(comment.id)}>
//             <FaHeart /> {comment.likes || 0}
//           </button>
//           <button
//             onClick={() =>
//               setReplyInputs((prev) => ({
//                 ...prev,
//                 [comment.id]: prev[comment.id] || "",
//               }))
//             }
//           >
//             Reply
//           </button>
//         </div>
//         {replyInputs[comment.id] !== undefined && (
//           <div className={styles.replyInput}>
//             <input
//               value={replyInputs[comment.id] || ""}
//               onChange={(e) =>
//                 handleReplyInputChange(comment.id, e.target.value)
//               }
//               placeholder="Write a reply..."
//               className={styles.input}
//             />
//             <button
//               onClick={() => handleReplyComment(comment.id)}
//               className={styles.post_button}
//             >
//               Reply
//             </button>
//           </div>
//         )}
//         {comment.replies?.map((reply: { id: React.Key | null | undefined }) => (
//           <div key={reply.id} className={styles.reply}>
//             {renderComment(reply, depth + 1)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className={styles.main}>
//       <div className={styles.data}>
//         <div className={styles.title}>
//           <img src="/dp1.jpg" className={styles.dp} />
//           <p className={styles.t1}>{title}</p>
//         </div>
//         <p className={styles.t2}>2 hours ago</p>
//       </div>

//       {isImageLoading && (
//         <div className={styles.loadingSpinner}>
//           <div className={styles.spinner}></div>
//         </div>
//       )}
//       <img
//         src={imgUrl}
//         alt={alt}
//         className={`${styles.img} ${isImageLoading ? styles.hidden : ""}`}
//         onLoad={handleImageLoad}
//         onError={handleImageError}
//       />
//       <div className={styles.likes}>
//         <div className={styles.interactions}>
//           <FaHeart className={styles.icon} />
//           <MessageCircle className={styles.icon} />
//           <Send className={styles.icon} />
//         </div>
//         <FaRegBookmark className={styles.icon} />
//       </div>
//       <div className={styles.likecountdiv}>
//         <p className={styles.likecount}>{likecount} Likes</p>
//       </div>

//       <p className={styles.desc}>{body}</p>
//       <div className={styles.likecountdiv}>
//         <p
//           className={styles.commentcount}
//           onClick={() => {
//             setIsOpen(!isOpen);
//           }}
//         >
//           View all {comments.length} comments
//         </p>
//       </div>
//       <div className={styles.inputs}>
//         <input
//           className={styles.input}
//           placeholder="Add a comment"
//           value={commentInput}
//           onChange={(e) => setCommentInput(e.target.value)}
//         />
//         <button className={styles.post} onClick={handleAddComment}>
//           Post
//         </button>
//       </div>
//       {isOpen && (
//         <div className={styles.main_comments}>
//           <div className={styles.close}>
//             <FaTimes
//               className={styles.closeicon}
//               onClick={() => {
//                 setIsOpen(!isOpen);
//               }}
//             />
//           </div>
//           <div className={styles.comment_div}>
//             <div className={styles.comment_img}>
//               <img
//                 src={imgUrl}
//                 alt={alt}
//                 className={styles.commentimg}
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//               />
//             </div>
//             <div className={styles.comments}>
//               <div className={styles.data}>
//                 <div className={styles.title}>
//                   <img src="/dp1.jpg" className={styles.dp} />
//                   <p className={styles.t1}>{title}</p>
//                 </div>
//                 <p className={styles.t2}>2 hours ago</p>
//               </div>
//               <div className={styles.allcomments}>
//                 {status === "loading" && <p>Loading comments...</p>}
//                 {status === "failed" && <p>Error: {error}</p>}
//                 {status === "succeeded" &&
//                   comments.map((comment) => renderComment(comment))}
//               </div>
//               <div className={styles.likes}>
//                 <div className={styles.interactions}>
//                   <FaHeart className={styles.icon} />
//                   <MessageCircle className={styles.icon} />
//                   <Send className={styles.icon} />
//                 </div>
//                 <FaRegBookmark className={styles.icon} />
//               </div>
//               <div className={styles.inputs}>
//                 <input
//                   className={styles.input2}
//                   placeholder="Post a comment"
//                   value={commentInput}
//                   onChange={(e) => setCommentInput(e.target.value)}
//                 />
//                 <button
//                   className={styles.post_button}
//                   onClick={handleAddComment}
//                 >
//                   Post
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import styles from "../styles/Post.module.css";
// import { FaHeart, FaRegBookmark, FaTimes } from "react-icons/fa";
// import { MessageCircle, Send } from "lucide-react";
// import {
//   fetchComments,
//   addComment,
//   likeComment,
//   replyComment,
//   resetComments,
//   likePost,
//   type Comment,
// } from "../redux/commentSlice";
// import type { AppDispatch, RootState } from "../redux/store";

// interface CircularImageProps {
//   imgUrl: string;
//   alt?: string;
//   body: string;
//   title: string;
//   likecount: string;
//   postId: string;
// }

// export default function Post({
//   imgUrl,
//   alt,
//   body,
//   title,
//   likecount,
//   postId,
// }: CircularImageProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const [commentInput, setCommentInput] = useState("");
//   const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
//   const dispatch = useDispatch<AppDispatch>();
//   const { comments, status, error, postLikes } = useSelector(
//     (state: RootState) => state.comments
//   );

//   useEffect(() => {
//     if (isOpen) {
//       dispatch(fetchComments(postId));
//     } else {
//       dispatch(resetComments());
//     }
//   }, [isOpen, dispatch, postId]);

//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//   };

//   const handleImageError = () => {
//     setIsImageLoading(false);
//     console.error("Failed to load image");
//   };

//   const handleAddComment = () => {
//     if (commentInput.trim()) {
//       dispatch(addComment({ postId, content: commentInput }));
//       setCommentInput("");
//     }
//   };

//   const handleLikePost = () => {
//     alert(postId);
//     dispatch(likePost(postId));
//   };

//   const handleLikeComment = (commentId: string) => {
//     dispatch(likeComment(commentId));
//   };

//   const handleReplyComment = (commentId: string) => {
//     const replyContent = replyInputs[commentId]?.trim();
//     if (replyContent) {
//       dispatch(
//         replyComment({
//           postId,
//           parentCommentId: commentId,
//           content: replyContent,
//           replyToUserId: commentId,
//           commentId: postId,
//         })
//       );
//       setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
//     }
//   };

//   const handleReplyInputChange = (commentId: string, value: string) => {
//     setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
//   };

//   const renderComment = (comment: Comment, depth = 0) => {
//     return (
//       <div key={comment._id} className={styles.comment}>
//         <div className={styles.commentHeader}>
//           <img src="/dp1.jpg" className={styles.dp} />
//           <div>
//             <p className={styles.t1}>{comment.user}</p>
//             <p className={styles.t2}>
//               {new Date(comment.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>
//         <p className={styles.commentContent}>{comment.content}</p>
//         <div className={styles.commentActions}>
//           <button onClick={() => handleLikeComment(comment._id)}>
//             <FaHeart /> {comment.likes || 0}
//           </button>
//           <button
//             onClick={() =>
//               setReplyInputs((prev) => ({
//                 ...prev,
//                 [comment._id]: prev[comment._id] || "",
//               }))
//             }
//           >
//             Reply
//           </button>
//         </div>
//         {replyInputs[comment._id] !== undefined && (
//           <div className={styles.replyInput}>
//             <input
//               value={replyInputs[comment._id] || ""}
//               onChange={(e) =>
//                 handleReplyInputChange(comment._id, e.target.value)
//               }
//               placeholder="Write a reply..."
//               className={styles.input}
//             />
//             <button
//               onClick={() => handleReplyComment(comment._id)}
//               className={styles.post_button}
//             >
//               Reply
//             </button>
//           </div>
//         )}
//         {comment.replies?.map((reply: Comment) => (
//           <div key={reply._id} className={styles.reply}>
//             {renderComment(reply, depth + 1)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className={styles.main}>
//       <div className={styles.data}>
//         <div className={styles.title}>
//           <img src="/dp1.jpg" className={styles.dp} />
//           <p className={styles.t1}>{title}</p>
//         </div>
//         <p className={styles.t2}>2 hours ago</p>
//       </div>

//       {isImageLoading && (
//         <div className={styles.loadingSpinner}>
//           <div className={styles.spinner}></div>
//         </div>
//       )}
//       <img
//         src={imgUrl}
//         alt={alt}
//         className={`${styles.img} ${isImageLoading ? styles.hidden : ""}`}
//         onLoad={handleImageLoad}
//         onError={handleImageError}
//       />
//       <div className={styles.likes}>
//         <div className={styles.interactions}>
//           <button onClick={handleLikePost}>
//             <FaHeart className={styles.icon} />
//           </button>
//           <MessageCircle className={styles.icon} />
//           <Send className={styles.icon} />
//         </div>
//         <FaRegBookmark className={styles.icon} />
//       </div>
//       <div className={styles.likecountdiv}>
//         <p className={styles.likecount}>
//           {postLikes[postId] ?? likecount} Likes
//         </p>
//       </div>

//       <p className={styles.desc}>{body}</p>
//       <div className={styles.likecountdiv}>
//         <p
//           className={styles.commentcount}
//           onClick={() => {
//             setIsOpen(!isOpen);
//           }}
//         >
//           View all {comments.length} comments
//         </p>
//       </div>
//       <div className={styles.inputs}>
//         <input
//           className={styles.input}
//           placeholder="Add a comment"
//           value={commentInput}
//           onChange={(e) => setCommentInput(e.target.value)}
//         />
//         <button className={styles.post} onClick={handleAddComment}>
//           Post
//         </button>
//       </div>
//       {isOpen && (
//         <div className={styles.main_comments}>
//           <div className={styles.close}>
//             <FaTimes
//               className={styles.closeicon}
//               onClick={() => {
//                 setIsOpen(!isOpen);
//               }}
//             />
//           </div>
//           <div className={styles.comment_div}>
//             <div className={styles.comment_img}>
//               <img
//                 src={imgUrl}
//                 alt={alt}
//                 className={styles.commentimg}
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//               />
//             </div>
//             <div className={styles.comments}>
//               <div className={styles.data}>
//                 <div className={styles.title}>
//                   <img src="/dp1.jpg" className={styles.dp} />
//                   <p className={styles.t1}>{title}</p>
//                 </div>
//                 <p className={styles.t2}>2 hours ago</p>
//               </div>
//               <div className={styles.allcomments}>
//                 {status === "loading" && <p>Loading comments...</p>}
//                 {status === "failed" && <p>Error: {error}</p>}
//                 {status === "succeeded" &&
//                   comments.map((comment) => renderComment(comment))}
//               </div>
//               <div className={styles.likes}>
//                 <div className={styles.interactions}>
//                   <button onClick={handleLikePost}>
//                     <FaHeart className={styles.icon} />
//                   </button>
//                   <MessageCircle className={styles.icon} />
//                   <Send className={styles.icon} />
//                 </div>
//                 <FaRegBookmark className={styles.icon} />
//               </div>
//               <div className={styles.inputs}>
//                 <input
//                   className={styles.input2}
//                   placeholder="Post a comment"
//                   value={commentInput}
//                   onChange={(e) => setCommentInput(e.target.value)}
//                 />
//                 <button
//                   className={styles.post_button}
//                   onClick={handleAddComment}
//                 >
//                   Post
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import {
//   createSlice,
//   createAsyncThunk,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import axios from "axios";

// export interface Comment {
//   _id: string;
//   postId: string;
//   user: string;
//   content: string;
//   createdAt: string;
//   likes?: number;
//   replies?: Comment[];
// }

// export interface CommentsState {
//   comments: Comment[];
//   postLikes: { [postId: string]: number };
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: CommentsState = {
//   comments: [],
//   postLikes: {},
//   status: "idle",
//   error: null,
// };

// let token = localStorage.getItem("instagram_user");
// let cleanedUser = token?.slice(1, -1);
// const headers = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${cleanedUser}`,
// };

// export const fetchComments = createAsyncThunk<Comment[], string>(
//   "comments/fetchComments",
//   async (postId: string) => {
//     const response = await axios.get(
//       `http://172.50.5.102:3008/interaction/comment/${postId}`,
//       { headers }
//     );
//     return response.data.data.comments as Comment[];
//   }
// );

// export const addComment = createAsyncThunk<
//   Comment,
//   { postId: string; content: string }
// >("comments/addComment", async ({ postId, content }) => {
//   const response = await axios.post(
//     "http://172.50.5.102:3008/interaction/comment",
//     { postId, content },
//     { headers }
//   );
//   return response.data as Comment;
// });

// export const likeComment = createAsyncThunk<
//   { commentId: string; likes: number },
//   string
// >("comments/likeComment", async (commentId: string) => {
//   const response = await axios.post(
//     `http://172.50.5.102:3008/interaction/comment/like`,
//     { commentId },
//     { headers }
//   );
//   return { commentId, likes: response.data.likes } as {
//     commentId: string;
//     likes: number;
//   };
// });

// export const replyComment = createAsyncThunk<
//   { commentId: string; reply: Comment },
//   {
//     commentId: string;
//     content: string;
//     postId: string;
//     parentCommentId: string;
//     replyToUserId: string;
//   }
// >(
//   "comments/replyComment",
//   async ({ commentId, content, postId, parentCommentId, replyToUserId }) => {
//     const response = await axios.post(
//       `http://172.50.5.102:3008/interaction/comment`,
//       { postId, content, parentCommentId, replyToUserId },
//       { headers }
//     );
//     return { commentId, reply: response.data as Comment };
//   }
// );

// export const fetchAllReplies = createAsyncThunk<Comment[], string>(
//   "comments/fetchAllReplies",
//   async (commentId: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `http://172.50.5.102:3008/interaction/comment/replies/${commentId}`,
//         { headers }
//       );
//       console.log("fetchAllReplies response:", response.data); // Debug log
//       return (response.data.data?.replies ||
//         response.data.replies ||
//         []) as Comment[];
//     } catch (error) {
//       console.error("fetchAllReplies error:", error); // Debug log
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data || "Failed to fetch replies"
//         );
//       }
//       return rejectWithValue("Unexpected error occurred");
//     }
//   }
// );

// export const likePost = createAsyncThunk<
//   { postId: string; likes: number },
//   string
// >("comments/likePost", async (postId: string, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(
//       `http://172.50.5.102:3008/interaction/react`,
//       { postId },
//       { headers }
//     );
//     return { postId, likes: response.data.likes } as {
//       postId: string;
//       likes: number;
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return rejectWithValue(
//         error.response?.data || "Unauthorized or server error"
//       );
//     }
//     return rejectWithValue("Unexpected error occurred");
//   }
// });

// const commentsSlice = createSlice({
//   name: "comments",
//   initialState,
//   reducers: {
//     resetComments: (state) => {
//       state.comments = [];
//       state.status = "idle";
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Comments
//       .addCase(fetchComments.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         fetchComments.fulfilled,
//         (state, action: PayloadAction<Comment[]>) => {
//           state.status = "succeeded";
//           state.comments = action.payload;
//         }
//       )
//       .addCase(fetchComments.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Failed to fetch comments";
//       })
//       // Add Comment
//       .addCase(
//         addComment.fulfilled,
//         (state, action: PayloadAction<Comment>) => {
//           state.comments.push(action.payload);
//         }
//       )
//       .addCase(addComment.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Failed to add comment";
//       })
//       // Like Comment
//       .addCase(
//         likeComment.fulfilled,
//         (
//           state,
//           action: PayloadAction<{ commentId: string; likes: number }>
//         ) => {
//           const { commentId, likes } = action.payload;
//           const updateCommentLikes = (comments: Comment[]) => {
//             for (const comment of comments) {
//               if (comment._id === commentId) {
//                 comment.likes = likes;
//                 return true;
//               }
//               if (comment.replies) {
//                 const found = updateCommentLikes(comment.replies);
//                 if (found) return true;
//               }
//             }
//             return false;
//           };
//           updateCommentLikes(state.comments);
//         }
//       )
//       .addCase(likeComment.rejected, (state, action) => {
//         state.error = action.error.message || "Failed to like comment";
//       })
//       // Reply Comment
//       .addCase(
//         replyComment.fulfilled,
//         (
//           state,
//           action: PayloadAction<{ commentId: string; reply: Comment }>
//         ) => {
//           const { commentId, reply } = action.payload;
//           const updateCommentReplies = (comments: Comment[]) => {
//             for (const comment of comments) {
//               if (comment._id === commentId) {
//                 comment.replies = comment.replies || [];
//                 comment.replies.push(reply);
//                 return true;
//               }
//               if (comment.replies) {
//                 const found = updateCommentReplies(comment.replies);
//                 if (found) return true;
//               }
//             }
//             return false;
//           };
//           updateCommentReplies(state.comments);
//         }
//       )
//       .addCase(replyComment.rejected, (state, action) => {
//         state.error = action.error.message || "Failed to add reply";
//       })
//       // Fetch All Replies
//       .addCase(fetchAllReplies.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         fetchAllReplies.fulfilled,
//         (state, action: PayloadAction<Comment[], string, { arg: string }>) => {
//           state.status = "succeeded";
//           const commentId = action.meta.arg;
//           console.log(
//             "Updating replies for commentId:",
//             commentId,
//             "with:",
//             action.payload
//           ); // Debug log
//           const updateReplies = (comments: Comment[]) => {
//             for (const comment of comments) {
//               if (comment._id === commentId) {
//                 comment.replies = action.payload || []; // Ensure replies is always an array
//                 return true;
//               }
//               if (comment.replies) {
//                 const found = updateReplies(comment.replies);
//                 if (found) return true;
//               }
//             }
//             return false;
//           };
//           updateReplies(state.comments);
//         }
//       )
//       .addCase(fetchAllReplies.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Failed to fetch replies";
//         console.error("fetchAllReplies failed:", state.error); // Debug log
//       })
//       // Like Post
//       .addCase(
//         likePost.fulfilled,
//         (state, action: PayloadAction<{ postId: string; likes: number }>) => {
//           const { postId, likes } = action.payload;
//           state.postLikes[postId] = likes;
//         }
//       )
//       .addCase(likePost.rejected, (state, action) => {
//         state.error = action.error.message || "Failed to like post";
//       });
//   },
// });

// export const { resetComments } = commentsSlice.actions;
// export default commentsSlice.reducer;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Post.module.css";
import { FaHeart, FaRegBookmark, FaRegHeart, FaTimes } from "react-icons/fa";
import { MessageCircle, Send } from "lucide-react";
import {
  fetchComments,
  addComment,
  likeComment,
  replyComment,
  resetComments,
  likePost,
  fetchAllReplies,
  type Comment,
} from "../redux/commentSlice";
import type { AppDispatch, RootState } from "../redux/store";

interface CircularImageProps {
  imgUrl: string;
  alt?: string;
  body: string;
  title: string;
  likecount: string;
  postId: string;
  isLiked: boolean;
}

export default function Post({
  imgUrl,
  alt,
  body,
  title,
  likecount,
  postId,
  isLiked,
}: CircularImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const dispatch = useDispatch<AppDispatch>();
  const { comments, status, error, postLikes } = useSelector(
    (state: RootState) => state.comments
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchComments(postId));
    } else {
      dispatch(resetComments());
    }
  }, [isOpen, dispatch, postId]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    console.error("Failed to load image");
  };

  const handleAddComment = () => {
    if (commentInput.trim()) {
      dispatch(addComment({ postId, content: commentInput }));
      setCommentInput("");
    }
  };

  const handleLikePost = () => {
    dispatch(likePost(postId));
  };

  const handleLikeComment = (commentId: string) => {
    console.log(commentId);
    dispatch(likeComment(commentId));
  };

  const handleReplyComment = (commentId: string) => {
    const replyContent = replyInputs[commentId]?.trim();
    if (replyContent) {
      dispatch(
        replyComment({
          postId,
          parentCommentId: commentId,
          content: replyContent,
          replyToUserId: commentId, // Adjust if replyToUserId is different
          commentId: postId,
        })
      );
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
    }
  };

  const handleReplyInputChange = (commentId: string, value: string) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    if (!showReplies[commentId]) {
      dispatch(fetchAllReplies(commentId)); // Fetch replies when toggled
    }
  };

  const renderComment = (comment: Comment, depth = 0) => {
    return (
      <div key={comment._id} className={styles.comment}>
        <div className={styles.commentHeader}>
          <img src="/dp1.jpg" className={styles.dp} />
          <div>
            <p className={styles.t1}>{comment.user}</p>
            <p className={styles.t2}>
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className={styles.commentContent}>{comment.content}</p>
        <div className={styles.commentActions}>
          <button
            onClick={() => {
              console.log(comment.commentId);
              handleLikeComment(comment.commentId);
            }}
          >
            <FaHeart /> {comment.likes || 0}
          </button>
          <button
            onClick={() =>
              setReplyInputs((prev) => ({
                ...prev,
                [comment._id]: prev[comment._id] || "",
              }))
            }
          >
            Reply
          </button>
          <button onClick={() => toggleReplies(comment._id)}>
            {showReplies[comment._id]
              ? "Hide Replies"
              : `View ${comment.replies?.length || 0} Replies`}
          </button>
        </div>
        {replyInputs[comment._id] !== undefined && (
          <div className={styles.replyInput}>
            <input
              value={replyInputs[comment._id] || ""}
              onChange={(e) =>
                handleReplyInputChange(comment._id, e.target.value)
              }
              placeholder="Write a reply..."
              className={styles.input}
            />
            <button
              onClick={() => handleReplyComment(comment._id)}
              className={styles.post_button}
            >
              Reply
            </button>
          </div>
        )}
        {showReplies[comment._id] && (
          <div className={styles.replies}>
            {status === "loading" && <p>Loading replies...</p>}
            {status === "failed" && <p>Error: {error}</p>}
            {comment.replies?.length ? (
              comment.replies.map((reply: Comment) => (
                <div key={reply._id} className={styles.reply}>
                  {renderComment(reply, depth + 1)}
                </div>
              ))
            ) : (
              <p>No replies yet</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.data}>
        <div className={styles.title}>
          <img src="/dp1.jpg" className={styles.dp} />
          <p className={styles.t1}>{title}</p>
        </div>
        <p className={styles.t2}>2 hours ago</p>
      </div>

      {isImageLoading && (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <img
        src={imgUrl}
        alt={alt}
        className={`${styles.img} ${isImageLoading ? styles.hidden : ""}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      <div className={styles.likes}>
        <div className={styles.interactions}>
          <button onClick={handleLikePost}>
            {isLiked ? (
              <FaHeart className={styles.icon} />
            ) : (
              <FaRegHeart className={styles.iconUnliked} />
            )}
          </button>
          <MessageCircle className={styles.icon} />
          <Send className={styles.icon} />
        </div>
        <FaRegBookmark className={styles.icon} />
      </div>
      <div className={styles.likecountdiv}>
        <p className={styles.likecount}>
          {postLikes[postId] ?? likecount} Likes
        </p>
      </div>

      <p className={styles.desc}>{body}</p>
      <div className={styles.likecountdiv}>
        <p
          className={styles.commentcount}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          View all {comments.length} comments
        </p>
      </div>
      <div className={styles.inputs}>
        <input
          className={styles.input}
          placeholder="Add a comment"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button className={styles.post} onClick={handleAddComment}>
          Post
        </button>
      </div>
      {isOpen && (
        <div className={styles.main_comments}>
          <div className={styles.close}>
            <FaTimes
              className={styles.closeicon}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
          </div>
          <div className={styles.comment_div}>
            <div className={styles.comment_img}>
              <img
                src={imgUrl}
                alt={alt}
                className={styles.commentimg}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
            <div className={styles.comments}>
              <div className={styles.data}>
                <div className={styles.title}>
                  <img src="/dp1.jpg" className={styles.dp} />
                  <p className={styles.t1}>{title}</p>
                </div>
                <p className={styles.t2}>2 hours ago</p>
              </div>
              <div className={styles.allcomments}>
                {status === "loading" && <p>Loading comments...</p>}
                {status === "failed" && <p>Error: {error}</p>}
                {status === "succeeded" &&
                  comments.map((comment) => renderComment(comment))}
              </div>
              <div className={styles.likes}>
                <div className={styles.interactions}>
                  <button onClick={handleLikePost}>
                    <FaHeart className={styles.icon} />
                  </button>
                  <MessageCircle className={styles.icon} />
                  <Send className={styles.icon} />
                </div>
                <FaRegBookmark className={styles.icon} />
              </div>
              <div className={styles.inputs}>
                <input
                  className={styles.input2}
                  placeholder="Post a comment"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button
                  className={styles.post_button}
                  onClick={handleAddComment}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
