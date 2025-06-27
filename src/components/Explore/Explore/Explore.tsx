import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchFeedPosts } from "../../../redux/slices/exploreSlice";

import ExploreHeader from "../ExploreHeader/ExploreHeader";
import ExploreGrid from "../ExploreGrid/ExploreGrid";
import SearchResults from "../SearchResult/SearchResults";
import PostModal from "../PostModal/PostModal";

import styles from "./Explore.module.css";

const Explore: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSearching, posts, page, error, isLoading } = useAppSelector(
    (state) => state.explore
  );

  useEffect(() => {
    if (posts.length === 0 && !isLoading && !isSearching) {
      dispatch(fetchFeedPosts(page));
    }
  }, [dispatch, posts.length, page, isLoading, isSearching]);

  return (
    <div className={styles.exploreContainer}>
      <ExploreHeader />
      <div className={styles.contentWrapper}>
        {error && <div className={styles.errorMessage}>Error: {error}</div>}
        {isLoading && <div className={styles.loadingMessage}></div>}
        {isSearching ? <SearchResults /> : <ExploreGrid />}
      </div>
      <PostModal />
    </div>
  );
};

export default Explore;
