import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";

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

import { FaHeart, FaRegBookmark, FaRegHeart, FaTimes } from "react-icons/fa";
import { MessageCircle, Send } from "lucide-react";

import styles from "../styles/Post.module.css";
import { CircularImageProps } from "../interfaces/posts.interface";

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
          replyToUserId: commentId,
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
      dispatch(fetchAllReplies(commentId));
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchComments(postId));
    } else {
      dispatch(resetComments());
    }
  }, [isOpen, dispatch, postId]);

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
          <button onClick={() => toggleReplies(comment.commentId)}>
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
