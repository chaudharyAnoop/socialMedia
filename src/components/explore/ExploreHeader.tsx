import React, { useState, useRef, useEffect } from "react";
import { Search, Grid3X3, Bookmark, UserCheck, Tag } from "lucide-react";
import RecentSearches from "../explore/RecentSearches";
import styles from "./ExploreHeader.module.css";
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
      setIsSearchFocused(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
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

  return (
    <div className={styles.headerContainer}>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchRelativeContainer} ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className={styles.searchInputContainer}>
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
          {isSearchFocused && <RecentSearches />}
        </div>
      </div>

      {!searchQuery && (
        <div className={styles.categoryTabsContainer}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.label}
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