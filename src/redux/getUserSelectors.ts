import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

const selectUserState = (state: RootState) => state.user;

export const selectUser = createSelector(
  selectUserState,
  (userState) => userState.user
);

export const selectStatus = createSelector(
  selectUserState,
  (userState) => userState.status
);

export const selectError = createSelector(
  selectUserState,
  (userState) => userState.error
);
