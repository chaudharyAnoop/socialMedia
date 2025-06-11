import React from "react";
import styles from "./NavigationTile.module.css";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa";

function NavigationTile() {
  return (
    <NavLink to="/" className={styles.link}>
      <div className={styles.tile}>
        <div className={styles.name}>
          <FaUser className={styles.icon} />
          <p className={styles.head}> Profile</p>
        </div>
        {/* <p className={styles.val}>10</p> */}
      </div>
    </NavLink>
  );
}

export default NavigationTile;
