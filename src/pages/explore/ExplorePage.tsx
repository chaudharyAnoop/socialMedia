import React from "react";
import { Provider } from "react-redux";
import Explore from "../../components/explore/Explore";

// Import the CSS module
import styles from "./explore.module.css"; // Adjust path if your CSS file is elsewhere

const ExplorePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Explore />
    </div>
  );
};

export default ExplorePage;
