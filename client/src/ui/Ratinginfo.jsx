import React from "react";
import styles from "../styles/Ratinginfo.module.css";
const Ratinginfo = ({ ratinginfo }) => {
  const currentrating = ratinginfo?.rating;
  const Highestrating = ratinginfo?.maxRating;
  return (
    <div className={styles.container}>
      <div className={styles.top}>{currentrating}</div>
      <div className={styles.middle}>
        <p className={styles.byteblitzratingtext}>ByteBlitz Rating</p>
        <p className={styles.higherating}>(Highest Rating: {Highestrating})</p>
      </div>
      <div className={styles.bottom}>
        {/* <p>{globalrank}</p> */}
        <p>Global Rank</p>
      </div>
    </div>
  );
};

export default Ratinginfo;
