import React, { useContext } from "react";
import styles from "../styles/ProblemsTable.module.css";
import Pagination from "./Pagination";
import { ProblemsContext } from "../context/ProblemsContext";

const ProblemsGrid = () => {
  const { problems, totalPages, setPage, page } = useContext(ProblemsContext);
  return (
    <div className={styles.grid}>
      <div className={styles.gridContainer}>
        {/* Header */}
        <div className={`${styles.gridRow} ${styles.gridHeader}`}>
          <div>ID</div>
          <div>Title</div>
          <div>Rating</div>
          <div>Solved By</div>
          <div>Status</div>
        </div>

        {/* Problem Entries */}
        {problems?.map((problem, index) => (
          <div key={index} className={styles.gridRow}>
            <div className={styles.gridRowItem}>{problem.id}</div>
            <div className={styles.gridRowItem}>{problem.title}</div>
            <div className={styles.gridRowItem}>{problem.rating}</div>
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
