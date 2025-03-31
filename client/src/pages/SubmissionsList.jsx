import React from "react";
import styles from "../styles/SubmissionsList.module.css";
import tickIcon from "../assets/tick.svg";
import crossIcon from "../assets/cross.svg";
import { Link, useOutletContext } from 'react-router-dom';

const dummySubmissions = [
    { id: 1, submissionLink: '/problems', status: "Accepted", time: "0.3s", memory: "400KB", language: "C++", icon: tickIcon },
    { id: 2, submissionLink: '/problems', status: "Accepted", time: "0.3s", memory: "400KB", language: "C++", icon: tickIcon },
    { id: 3, submissionLink: '/problems', status: "Wrong Answer", time: "0.3s", memory: "400KB", language: "C++", icon: crossIcon },
    { id: 4, submissionLink: '/problems', status: "Wrong Answer", time: "0.3s", memory: "400KB", language: "C++", icon: crossIcon },
    { id: 5, submissionLink: '/problems', status: "Wrong Answer", time: "0.3s", memory: "400KB", language: "C++", icon: crossIcon },
    { id: 6, submissionLink: '/problems', status: "Wrong Answer", time: "0.3s", memory: "400KB", language: "C++", icon: crossIcon },
    { id: 7, submissionLink: '/problems', status: "Wrong Answer", time: "0.3s", memory: "400KB", language: "C++", icon: crossIcon },
];

const SubmissionList = () => {
    const { problemId } = useOutletContext();
    
    return (
        <div className={styles.problemSubmissions}>
            {/* Header */}
            <div className={styles.problemSubmissionHeader}>
                {["Submission", "Status", "Time", "Memory", "Language"].map((header, index) => (
                    <div key={index} className={styles.headerItem}>
                        <span>{header}</span>
                    </div>
                ))}
            </div>

            {/* Submission Rows */}
            {dummySubmissions.map((submission) => (
                <div key={submission.id} className={styles.problemSubmissionInfo}>
                    <div className={styles.infoItem}>
                        <Link to={submission.submissionLink}>
                            <p>Click Here</p>
                        </Link>
                    </div>
                    <div className={styles.infoItem}>
                        <img src={submission.icon} alt={submission.status} className={styles.icon} />
                    </div>
                    <div className={styles.infoItem}>
                        <p>{submission.time}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <p>{submission.memory}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <p>{submission.language}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubmissionList;