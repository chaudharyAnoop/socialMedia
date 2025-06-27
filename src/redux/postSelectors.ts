import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

const selectPostsState = (state: RootState) => state.posts;

export const selectPosts = createSelector(
  selectPostsState,
  (postsState) => postsState.posts
);

export const selectStatus = createSelector(
  selectPostsState,
  (postsState) => postsState.status
);

export const selectError = createSelector(
  selectPostsState,
  (postsState) => postsState.error
);

export const selectPage = createSelector(
  selectPostsState,
  (postsState) => postsState.page
);

export const selectLimit = createSelector(
  selectPostsState,
  (postsState) => postsState.limit
);

export const selectHasMore = createSelector(
  selectPostsState,
  (postsState) => postsState.hasMore
);
