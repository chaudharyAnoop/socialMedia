import React from "react";
import { Clock, X, Search } from "lucide-react";

// Import the CSS module
import styles from "./RecentSearches.module.css"; // Adjust path if your CSS file is elsewhere
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
    dispatch(addRecentSearch(search)); // Re-add to move it to the top of recents
  };

  const handleRemoveSearch = (e: React.MouseEvent, search: string) => {
    e.stopPropagation(); // Prevent the parent div's onClick from firing
    dispatch(removeRecentSearch(search));
  };

  const handleClearAll = () => {
    dispatch(clearRecentSearches());
  };

  // Only show when search input is focused but empty
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
                className={styles.recentSearchItem} // Base and group hover handled in CSS
                onClick={() => handleRecentSearchClick(search)}
              >
                <div className={styles.searchItemContent}>
                  <Clock className={styles.clockIcon} />
                  <span className={styles.searchText}>{search}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveSearch(e, search)}
                  className={styles.removeButton} // Opacity and hover handled in CSS
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
