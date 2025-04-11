import React from "react";
import styles from "../styles/Toprankings.module.css";
import white_arrow from "../assets/white_arrow.png";

const Toprankings = ({ data }) => {
  const topusers = data;

  return (
    <div className={styles.container}>
      {/* Rankings Header */}
      <div className={styles.header}>
        <div className={styles.headertext}>
          <p>Rankings</p>
        </div>

        <div>
          <img src={white_arrow} alt="Arrow" className={styles.white_arrow} />
        </div>
      </div>

      {/* Table for User Rankings */}
      <div className={styles.table}>
        <div className={styles.tabletitles}>
          <p className={styles.column}>User</p>
          <p className={styles.column}>Rating</p>
        </div>

        {topusers.map(({ username, rating }, index) => (
          <div className={styles.row} key={index}>
            <p className={styles.username}>{username}</p>
            <p className={styles.rating}>{rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toprankings;
