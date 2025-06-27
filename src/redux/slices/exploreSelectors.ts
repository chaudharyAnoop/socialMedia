import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";

const selectExploreState = (state: RootState) => state.explore;

export const selectPosts = createSelector(
  selectExploreState,
  (exploreState) => exploreState.posts
);

export const selectPage = createSelector(
  selectExploreState,
  (exploreState) => exploreState.page
);

export const selectIsLoading = createSelector(
  selectExploreState,
  (exploreState) => exploreState.isLoading
);

export const selectHasMore = createSelector(
  selectExploreState,
  (exploreState) => exploreState.hasMore
);

export const selectError = createSelector(
  selectExploreState,
  (exploreState) => exploreState.error
);

export const selectSearchResults = createSelector(
  selectExploreState,
  (exploreState) => exploreState.searchResults
);

export const selectIsSearchingLoading = createSelector(
  selectExploreState,
  (exploreState) => exploreState.isSearchingLoading
);

export const selectAccounts = createSelector(
  selectExploreState,
  (exploreState) => exploreState.accounts
);

export const selectSelectedPost = createSelector(
  selectExploreState,
  (exploreState) => exploreState.selectedPost
);

export const selectSearchQuery = createSelector(
  selectExploreState,
  (exploreState) => exploreState.searchQuery
);

export const selectRecentSearches = createSelector(
  selectExploreState,
  (exploreState) => exploreState.recentSearches
);

export const selectIsSearching = createSelector(
  selectExploreState,
  (exploreState) => exploreState.isSearching
);
