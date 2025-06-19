import React, { useState, useRef, useEffect } from "react";
import { Search, X, Grid3X3, Bookmark, UserCheck, Tag } from "lucide-react";
import RecentSearches from "../explore/RecentSearches";
import styles from "./ExploreHeader.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addRecentSearch,
  setSearchQuery,
  fetchSearchResults,
} from "../../redux/slices/exploreSlice";

const ExploreHeader: React.FC = () => {
  const { searchQuery, isSearchingLoading, error } = useAppSelector(
    (state) => state.explore
  );
  const dispatch = useAppDispatch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchQuery.trim();
      if (trimmed) {
        dispatch(fetchSearchResults(trimmed));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      dispatch(addRecentSearch(trimmed));
      dispatch(fetchSearchResults(trimmed)); // Trigger immediate search
      setIsSearchFocused(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(""));
    setIsSearchFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = [
    { icon: Grid3X3, label: "All", active: true },
    { icon: UserCheck, label: "People", active: false },
    { icon: Tag, label: "Tags", active: false },
    { icon: Bookmark, label: "Saved", active: false },
  ];

  const handleCategoryClick = (label: string) => {
    // Placeholder for category filtering (e.g., dispatch action to filter posts)
    console.log(`Category clicked: ${label}`);
    // Future: Dispatch an action to filter search results by category
    // Example: dispatch(setSearchFilter(label.toLowerCase()));
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchRelativeContainer} ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className={styles.searchInputContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search users or posts"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={styles.clearButton}
                  aria-label="Clear search"
                >
                  <X className={styles.clearIcon} />
                </button>
              )}
            </div>
          </form>
          {isSearchFocused && <RecentSearches />}
        </div>
      </div>

      {isSearchingLoading && (
        <div className={styles.loadingMessage}>Searching...</div>
      )}
      {error && (
        <div className={styles.errorMessage}>Error: {error}</div>
      )}

      {!searchQuery && (
        <div className={styles.categoryTabsContainer}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.label}
                onClick={() => handleCategoryClick(category.label)}
                className={`${styles.categoryButton} ${
                  category.active ? styles.active : ""
                }`}
              >
                <IconComponent className={styles.categoryButtonSvg} />
                <span className={styles.categoryButtonText}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExploreHeader;