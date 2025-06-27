import React from "react";

// Import the CSS module
import styles from "./explore.module.css"; // Adjust path if your CSS file is elsewhere
import Explore from "../../components/Explore/Explore/Explore";

const ExplorePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Explore />
    </div>
  );
};

export default ExplorePage;
