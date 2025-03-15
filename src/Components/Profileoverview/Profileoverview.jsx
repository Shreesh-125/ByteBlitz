import React, { useState } from "react";
import styles from "./Profileoverview.module.css";
import { Link, useLocation } from "react-router-dom";
import profileimage from "../../assets/profile_image.png";

const Profileoverview = () => {
  const [rating, setRating] = useState(1547);
  const [username, setUsername] = useState("Manu_codeup");
  
  const location = useLocation();

  const pathAndName = [
    ["/submissions", "Submissions"],
    ["/contests", "Contests"],
    ["/blogs", "Blogs"]
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>{username}</div>
      <div className={styles.mainSection}>
        <p className={styles.rating}>
          <strong>Rating:</strong> <span className={styles.ratingValue}>{rating}</span>
        </p>
        <div className={styles.mainBottom}>
            <div className={styles.left}>
                <ul className={styles.navLinks}>
                    {pathAndName.map(([path, name]) => (
                    <li key={path}>
                        <Link
                        to={path}
                        className={`${styles.navItem} ${location.pathname === path ? styles.active : ""}`}
                        >
                        {name}
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>
            <div className={styles.right}>
                <img src={profileimage} alt="Profile" className={styles.profileImage} />
                <p className={styles.username}>{username}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profileoverview;
