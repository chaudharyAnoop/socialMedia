import React from "react";
import ExploreHeader from "./ExploreHeader";
import ExploreGrid from "./ExploreGrid";
import SearchResults from "./SearchResults";
import PostModal from "./PostModal";

// Import the CSS module
import styles from "./Explore.module.css"; // Verify this path is correct
import { useAppSelector } from "../../redux/hooks";

const Explore: React.FC = () => {
  const { isSearching } = useAppSelector((state) => state.explore);

  return (
    // Apply the CSS module class to the main container
    // Use styles.exploreContainer
    <div className={styles.exploreContainer}>
      <ExploreHeader />
      {/* Apply the CSS module class to the content wrapper */}
      {/* Use styles.contentWrapper */}
      <div className={styles.contentWrapper}>
        {isSearching ? <SearchResults /> : <ExploreGrid />}
      </div>
      <PostModal />
    </div>
  );
};

export default Explore;
