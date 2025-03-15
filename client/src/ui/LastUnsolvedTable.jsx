import React, { useEffect, useState } from "react";
import styles from "../styles/LastUnsolved.module.css";
import { Link } from "react-router-dom";

const data = [
    { title: "Palindrome Number", link: "Check Here" },
    { title: "ZigZag Conversion", link: "Check Here" },
    { title: "Longest Palindromic Subsequence", link: "Check Here" },
    { title: "Container with most water", link: "Check Here" },
];

const LastUnsolved = () => {

    return (
        <div className={styles.grid}>

            <div className={styles.gridContainer}>
                <div className={styles.heading}>
                    Recent Submissions
                </div>
                {/* Header */}
                <div className={`${styles.gridRow} ${styles.gridHeader}`}>
                    <div>Title</div>
                    <div>Your Submissions</div>
                </div>

                {/* Problem Entries */}
                {data.map((problem, index) => (
                    <div key={index} className={styles.gridRow}>
                        <div className={styles.gridRowItem}>{problem.title}</div>
                        <Link to='/problems/20'>
                            <div className={`${styles.gridRowItem} ${styles.gridRowLink}`}>{problem.link}</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LastUnsolved;
