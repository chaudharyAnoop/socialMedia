import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

const selectNavigationBarState = (state: RootState) => state.sidebar;

export const selectIsVisible = createSelector(
  selectNavigationBarState,
  (navigationBarState) => navigationBarState.isVisible
);
