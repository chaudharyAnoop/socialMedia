import React, { useEffect, useRef } from "react";
import { Clock, X, Search } from "lucide-react";
import styles from "./RecentSearches.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  setSearchQuery,
  fetchSearchResults,
} from "../../redux/slices/exploreSlice";

const RecentSearches: React.FC = () => {
  const { recentSearches, searchQuery, isSearchingLoading, error } = useAppSelector(
    (state) => state.explore
  );
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus the dropdown when it mounts for accessibility
  useEffect(() => {
    if (dropdownRef.current && !searchQuery.length) {
      dropdownRef.current.focus();
    }
  }, [searchQuery.length]);

  const handleRecentSearchClick = (search: string) => {
    if (searchQuery !== search) {
      dispatch(setSearchQuery(search));
      dispatch(addRecentSearch(search));
      dispatch(fetchSearchResults(search));
    }
  };

  const handleRemoveSearch = (e: React.MouseEvent, search: string) => {
    e.stopPropagation();
    dispatch(removeRecentSearch(search));
  };

  const handleClearAll = () => {
    dispatch(clearRecentSearches());
  };

  const handleKeyDown = (e: React.KeyboardEvent, search: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRecentSearchClick(search);
    }
  };

  if (searchQuery.length > 0) return null;

  return (
    <div
      className={styles.recentSearchesDropdown}
      role="dialog"
      aria-label="Recent Searches"
      tabIndex={0}
      ref={dropdownRef}
    >
      {isSearchingLoading && (
        <div className={styles.loadingMessage} role="status">
          Searching...
        </div>
      )}
      {error && (
        <div className={styles.errorMessage} role="alert">
          Failed to load search results. Please check your connection and try again.
        </div>
      )}
      {recentSearches.length > 0 ? (
        <>
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>Recent</h3>
            <button
              onClick={handleClearAll}
              className={styles.clearAllButton}
              aria-label="Clear all recent searches"
            >
              Clear all
            </button>
          </div>
          <div className={styles.recentSearchList} role="list">
            {recentSearches.map((search) => (
              <div
                key={search}
                className={styles.recentSearchItem}
                onClick={() => handleRecentSearchClick(search)}
                onKeyDown={(e) => handleKeyDown(e, search)}
                role="button"
                tabIndex={0}
                aria-label={`Search for ${search}`}
              >
                <div className={styles.searchItemContent}>
                  <Clock className={styles.clockIcon} aria-hidden="true" />
                  <span className={styles.searchText}>{search}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveSearch(e, search)}
                  className={styles.removeButton}
                  aria-label={`Remove ${search} from recent searches`}
                >
                  <X aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <Search className={styles.emptySearchIcon} aria-hidden="true" />
          <p className={styles.emptyMessage}>No recent searches</p>
          <p className={styles.emptySubMessage}>
            Your search history will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentSearches;