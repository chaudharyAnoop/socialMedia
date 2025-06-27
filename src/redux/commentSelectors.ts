import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../redux/store";

const selectCommentState = (state: RootState) => state.comments;

export const selectComments = createSelector(
  selectCommentState,
  (commentState) => commentState.comments
);

export const selectStatus = createSelector(
  selectCommentState,
  (commentState) => commentState.status
);

export const selectError = createSelector(
  selectCommentState,
  (commentState) => commentState.error
);

export const selectPostLikes = createSelector(
  selectCommentState,
  (commentState) => commentState.postLikes
);
