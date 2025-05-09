import React, { useEffect, useState } from "react";
import styles from "../styles/Standings.module.css";
import Conteststandingspagination from "./Conteststandingspagination";
import { useParams } from 'react-router-dom'

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

const Standings = ({leaderboardData,NumberOfProblems}) => {
    console.log(leaderboardData);
    // console.log(NumberOfProblems);
    const {contestId} = useParams()
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 15;
    const totalPages = Math.ceil(data.length / problemsPerPage);

    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = data.slice(indexOfFirstProblem, indexOfLastProblem);

    const problemsArray = [];
    for(let i=0;i<NumberOfProblems;i++){
        problemsArray.push(String.fromCharCode(i+65));
    }
    

    return (
        <div className={styles["table-container"]} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}>
            <div className={styles["styled-table"]}>
                {/* Header */}
                <div className={styles["header-row"]}
                    style={{gridTemplateColumns: `7% 25% repeat(${NumberOfProblems+1},${68/(NumberOfProblems+1)}%)`}}
                >
                    <p className={styles.rankH}>Rank</p>
                    <p className={styles.usernameH}>Username</p>
                    {
                        problemsArray.map((element,index)=>(
                            <p className={styles["problemX"]} key={index}>{element}</p>
                        ))
                    }
                    <p className={styles["totalscoreH"]}>Total Score</p>
                </div>
                {/* Standings Entries */}
                <div>
                    {currentProblems.map((contestant, index) => (
                        <div key={index} className={styles["table-row"]}
                        style={{gridTemplateColumns: `7% 25% repeat(${NumberOfProblems+1},${68/(NumberOfProblems+1)}%)`}}
                        >
                            <p className={styles["rankH"]}>{contestant.rank}</p>
                            <p className={styles["usernameinrow" ]}>{contestant.username}</p>
                            {problemsArray.map((problem) => {
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
