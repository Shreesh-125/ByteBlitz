import React from "react";
import styles from "../styles//Recentsubmissions.module.css";
import wrong_icon from "../assets/wrong_icon.png";
import correct_icon from "../assets/correct_icon.png";

const Recentsubmissions = ({ probleminfo }) => {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>Recent Submissions</div>
        <div className={styles.table}>
          <div className={styles.header}>
            <p className={styles.when}>When</p>
            <p className={styles.problem}>ProblemId</p>
            <p className={styles.lang}>Lang</p>
            <p className={styles.solution}>Solution</p>
          </div>
          <div className={styles.list}>
            <ul>
              {probleminfo.map(
                ({ when, problemId, lang, solutionstatus }, index) => (
                  <li key={index} className={styles.listitem}>
                    <div className={styles.datetime}>
                      <p>{when.date}</p>
                      <p>{when.time}</p>
                    </div>
                    <p>{problemId}</p>
                    <p>{lang}</p>
                    <img
                      src={solutionstatus ? correct_icon : wrong_icon}
                      className={solutionstatus ? styles.correct : styles.wrong}
                      alt="solution status"
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recentsubmissions;
