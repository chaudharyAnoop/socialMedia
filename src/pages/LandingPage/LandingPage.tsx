import React, { useEffect, useRef, useCallback } from "react";
import styles from "./LandingPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchPosts, resetPosts } from "../../redux/postSlice";
import Post from "../../components/Post.component";
import { v4 as uuidv4 } from "uuid";

function LandingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status, error, page, hasMore } = useSelector(
    (state: RootState) => state.posts
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchPosts({ page, limit: 20 }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [status, hasMore, dispatch, page]
  );

  useEffect(() => {
    return () => {
      dispatch(resetPosts());
    };
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ page: 1, limit: 20 }));
    }
  }, [status, dispatch]);
  console.log(posts);

  return (
    <div className={styles.main}>
      <div className={styles.tags}>
        <p className={styles.t1}>Posts</p>
        <div className={styles.names}>
          <p className={styles.t2}>For you</p>
          <p className={styles.t3}>Following</p>
        </div>
      </div>
      {status === "loading" && posts.length === 0 && (
        <div className={styles.loading}>Loading...</div>
      )}
      {error && <div className={styles.error}>Error: {error}</div>}
      <div className={styles.posts}>
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post._id}>
                <Post
                  key={uuidv4()}
                  title={"post.title"}
                  likecount={"sadasdfdsf"}
                  body={"post.toString()"}
                  imgUrl={
                    `https://dummy-project-bucket.s3.ap-south-1.amazonaws.com/` +
                    "media/1750074781800-y8cnbn.png"
                  }
                  alt={"post.title"}
                  postId={post._id.toString()}
                />
                <p>vkjvhhv</p>
              </div>
            );
          }
          return (
            <Post
              key={uuidv4()}
              title={"post.title"}
              likecount={"post.reactions.likes.toString()"}
              body={"post.body"}
              imgUrl={`https://picsum.photos/2000/2000?random=${post._id}`}
              alt={"post.title"}
              postId={post._id.toString()}
            />
          );
        })}
      </div>
      {status === "loading" && posts.length > 0 && (
        <div className={styles.loading}>Loading more posts...</div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className={styles.noMore}>No more posts to load</div>
      )}
    </div>
  );
}

export default LandingPage;
