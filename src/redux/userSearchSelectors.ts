import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

const selectUserSearchState = (state: RootState) => state.userSearch;

export const selectUsers = createSelector(
  selectUserSearchState,
  (userSearchState) => userSearchState.users
);

export const selectTotalCount = createSelector(
  selectUserSearchState,
  (userSearchState) => userSearchState.totalCount
);

export const selectStatus = createSelector(
  selectUserSearchState,
  (userSearchState) => userSearchState.status
);

export const selectError = createSelector(
  selectUserSearchState,
  (userSearchState) => userSearchState.error
);
