import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/ProblemsTable.module.css";
import Pagination from "./Pagination";
import { ProblemsContext } from "../context/ProblemsContext";
const sampleData = [
  {
    id: 20,
    title: "Palindrome Number",
    rating: 1500,
    solvedBy: 2345,
    status: "Accepted",
  },
  {
    id: 84,
    title: "ZigZag Conversion",
    rating: 1800,
    solvedBy: 1234,
    status: "Accepted",
  },
];

const ProblemsGrid = () => {
  const { problems: data } = useContext(ProblemsContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [problems, setProblems] = useState(data);
  const problemsPerPage = 15;
  const totalPages = Math.ceil(data.length / problemsPerPage);

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  useEffect(() => {
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    setProblems(data.slice(indexOfFirstProblem, indexOfLastProblem));
  }, [currentPage, data]);

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
        {problems.map((problem, index) => (
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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ProblemsGrid;
