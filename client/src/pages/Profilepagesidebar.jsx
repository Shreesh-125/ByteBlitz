import React from "react";
import Ratinginfo from "../ui/Ratinginfo";
import Recentsubmissions from "../ui/Recentsubmissions";
import styles from "../styles/Profilepagesidebar.module.css";
import { formatSubmissions } from "../utils/profileUtils";
const Profilepagesidebar = ({ userData }) => {
  const probleminfo = formatSubmissions(userData?.user?.submissions);
  return (
    <div className={styles.profilepagesidebar}>
      <Ratinginfo ratinginfo={userData?.user} />
      <Recentsubmissions probleminfo={probleminfo} />
    </div>
  );
};

export default Profilepagesidebar;
