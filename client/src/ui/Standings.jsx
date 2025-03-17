import React, { useState } from "react";
import styles from "../styles/Standings.module.css";
import ContestStandingsPagination from "../styles/Conteststandingspagination.module.css"; // Pagination Component
import Conteststandingspagination from "./Conteststandingspagination";

const data = [
    { rank: 1, username: "Manu_codeup", A: { attempts: 3, time: 120 }, B: { attempts: -2 }, C: { attempts: 1, time: 90 }, D: { attempts: 0 }, E: { attempts: 4, time: 180 }, F: { attempts: -3 }, total: 450 },
    { rank: 2, username: "Zaxas", A: { attempts: -3 }, B: { attempts: 0 }, C: { attempts: -1 }, D: { attempts: 2, time: 150 }, E: { attempts: 3, time: 110 }, F: { attempts: 0 }, total: 415 },
    { rank: 3, username: "Shreesh_125", A: { attempts: 0 }, B: { attempts: 1, time: 200 }, C: { attempts: -2 }, D: { attempts: -4 }, E: { attempts: 0 }, F: { attempts: 2, time: 160 }, total: 385 },
    { rank: 4, username: "sujal_bhau", A: { attempts: 0 }, B: { attempts: 1, time: 200 }, C: { attempts: -2 }, D: { attempts: -4 }, E: { attempts: 0 }, F: { attempts: 2, time: 160 }, total: 385 },
    { rank: 5, username: "luday", A: { attempts: 0 }, B: { attempts: 1, time: 200 }, C: { attempts: -2 }, D: { attempts: -4 }, E: { attempts: 0 }, F: { attempts: 2, time: 160 }, total: 385 },
    { rank: 6, username: "ambrolliens619", A: { attempts: 0 }, B: { attempts: 1, time: 200 }, C: { attempts: -2 }, D: { attempts: -4 }, E: { attempts: 0 }, F: { attempts: 2, time: 160 }, total: 385 },
    { rank: 7, username: "zaxas_Alt", A: { attempts: 0 }, B: { attempts: 1, time: 200 }, C: { attempts: -2 }, D: { attempts: -4 }, E: { attempts: 0 }, F: { attempts: 2, time: 160 }, total: 385 },
    { rank: 8, username: "Shreesh_125_Alt", A: { attempts: 0 }, B: { attempts: 1, time: 200 }, C: { attempts: -2 }, D: { attempts: -4 }, E: { attempts: 0 }, F: { attempts: 2, time: 160 }, total: 385 },
];

const Standings = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 15;
    const totalPages = Math.ceil(data.length / problemsPerPage);

    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = data.slice(indexOfFirstProblem, indexOfLastProblem);

    return (
        <div className={styles["table-container"]} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}>
            <div className={styles["styled-table"]}>
                {/* Header */}
                <div className={styles["header-row"]}>
                    <p className={styles.rankH}>Rank</p>
                    <p className={styles.usernameH}>Username</p>
                    <p className={styles["problemX"]}>1</p>
                    <p className={styles["problemX"]}>2</p>
                    <p className={styles["problemX"]}>3</p>
                    <p className={styles["problemX"]}>4</p>
                    <p className={styles["problemX"]}>5</p>
                    <p className={styles["problemX"]}>6</p>
                    <p className={styles["totalscoreH"]}>Total Score</p>
                </div>
                {/* Standings Entries */}
                <div>
                    {currentProblems.map((contestant, index) => (
                        <div key={index} className={styles["table-row"]}>
                            <p className={styles["rankH"]}>{contestant.rank}</p>
                            <p className={styles["usernameinrow" ]}>{contestant.username}</p>
                            {["A", "B", "C", "D", "E", "F"].map((problem) => {
                                const problemData = contestant[problem];
                                if (problemData.attempts === 0) return <p key={problem} className={styles["table-cell"]}> - </p>;

                                return (
                                    <p
                                        key={problem}
                                        className={`${styles["table-cell"]} ${
                                            problemData.attempts > 0 ? styles["status-accepted"] : styles["status-rejected"]
                                        }`}
                                    >   
                                        {Math.abs(problemData.attempts)}
                                    </p>
                                );
                            })}
                            <p className={`${styles["table-cell"]} ${styles["total-score"]}`}>{contestant.total}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.pagination}>
                <Conteststandingspagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};

export default Standings;
