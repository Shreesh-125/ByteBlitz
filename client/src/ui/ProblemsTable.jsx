import React, { useContext } from "react";
import styles from "../styles/ProblemsTable.module.css";
import Pagination from "./Pagination";
import { ProblemsContext } from "../context/ProblemsContext";
import { Link } from "react-router-dom";

const ProblemsGrid = () => {
  const { problems, totalPages, setPage, page } = useContext(ProblemsContext);
  return (
    <div className={styles.grid}>
      <div className={styles.gridContainer}>
        {/* Header */}
        <div className={`${styles.gridRow} ${styles.gridHeader}`}>
          <div className={styles.headerItem}>ID</div>
          <div className={styles.headerItem}>Title</div>
          <div className={styles.headerItem}>Rating</div>
          <div className={styles.headerItem}>Solved By</div>
          <div className={styles.headerItem}>Status</div>
        </div>

        {/* Problem Entries */}
        {problems?.map((problem, index) => (
          <div key={index} className={`${styles.gridRow} ${styles.gridRowHover}`}>
            <div className={styles.gridRowItem}>{problem.id}</div>
            <Link 
              to={`${problem.id}`} 
              className={`${styles.gridRowItem} ${styles.problemTitle}`}
            >
              {problem.title}
            </Link>
            <div className={`${styles.gridRowItem} ${styles.rating}`}>
              {problem.rating}
            </div>
            <div className={`${styles.gridRowItem} ${styles.solvedBy}`}>
              {problem.solvedBy}
            </div>
            <div
              className={`${styles.status} ${styles.gridRowItem} ${
                styles[problem.status]
              }`}
            >
              {problem.status}
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        setCurrentPage={setPage}
      />
    </div>
  );
};

export default ProblemsGrid;