import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import Explore from '../../components/explore/Explore';

// Import the CSS module
import styles from "./explore.module.css"; // Adjust path if your CSS file is elsewhere

const ExplorePage: React.FC = () => {
  return (
    <Provider store={store}>
      {/* Apply the CSS module class */}
      <div className={styles.container}>
        {/* If you wanted a title specific to this page and styled via module CSS: */}
        {/* <h1 className={styles.pageTitle}>Explore Our Content</h1> */}
        <Explore />
      </div>
    </Provider>
  );
};

export default ExplorePage;