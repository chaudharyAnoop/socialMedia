import React from "react";
import { Clock, X, Search } from "lucide-react";
import styles from "./RecentSearches.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  setSearchQuery,
} from "../../redux/slices/exploreSlice";

const RecentSearches: React.FC = () => {
  const { recentSearches, searchQuery } = useAppSelector(
    (state) => state.explore
  );
  const dispatch = useAppDispatch();

  const handleRecentSearchClick = (search: string) => {
    dispatch(setSearchQuery(search));
    dispatch(addRecentSearch(search));
  };

  const handleRemoveSearch = (e: React.MouseEvent, search: string) => {
    e.stopPropagation();
    dispatch(removeRecentSearch(search));
  };

  const handleClearAll = () => {
    dispatch(clearRecentSearches());
  };

  if (searchQuery.length > 0) return null;

  return (
    <div className={styles.recentSearchesDropdown}>
      {recentSearches.length > 0 ? (
        <>
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>Recent</h3>
            <button onClick={handleClearAll} className={styles.clearAllButton}>
              Clear all
            </button>
          </div>
          <div className={styles.recentSearchList}>
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className={styles.recentSearchItem}
                onClick={() => handleRecentSearchClick(search)}
              >
                <div className={styles.searchItemContent}>
                  <Clock className={styles.clockIcon} />
                  <span className={styles.searchText}>{search}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveSearch(e, search)}
                  className={styles.removeButton}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <Search className={styles.emptySearchIcon} />
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