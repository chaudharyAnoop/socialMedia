import React, { useState, useRef, useEffect } from "react";
import { Search, Grid3X3, Bookmark, UserCheck, Tag } from "lucide-react";
import RecentSearches from "./RecentSearches";

// Import the CSS module
import styles from "./ExploreHeader.module.css"; // Adjust path if your CSS file is elsewhere
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addRecentSearch,
  setSearchQuery,
} from "../../redux/slices/exploreSlice";

const ExploreHeader: React.FC = () => {
  const { searchQuery } = useAppSelector((state) => state.explore);
  const dispatch = useAppDispatch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = [
    { icon: Grid3X3, label: "All", active: true },
    { icon: UserCheck, label: "People", active: false },
    { icon: Tag, label: "Tags", active: false },
    { icon: Bookmark, label: "Saved", active: false },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(addRecentSearch(searchQuery.trim()));
      setIsSearchFocused(false); // Close dropdown after submission
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle click outside to close recent searches
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

  return (
    <div className={styles.headerContainer}>
      {/* Search Bar */}
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchRelativeContainer} ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className={styles.searchRelativeContainer}>
              {" "}
              {/* This div was originally for relative positioning */}
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className={styles.searchInput}
              />
            </div>
          </form>

          {/* Recent Searches Dropdown */}
          {isSearchFocused && <RecentSearches />}
        </div>
      </div>

      {/* Category Tabs - Hide when searching */}
      {!searchQuery && (
        <div className={styles.categoryTabsContainer}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.label}
                // Conditionally apply 'active' class from module
                className={`${styles.categoryButton} ${
                  category.active ? styles.active : ""
                }`}
              >
                <IconComponent className={styles.categoryButtonSvg} />{" "}
                {/* Apply a specific class for the icon */}
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
