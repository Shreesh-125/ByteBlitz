import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Contestproblempage.module.css';
import contestimage from '../assets/contest.png';
import Problempagenavbar from '../ui/Problempagenavbar';

const Contestproblempage = () => {
    const ContestName = "BB Challenge 1";
    const [toendtime, setToendtime] = useState("02 : 39");
    const problems = [
        {
            srno: 1,
            problemtitle: 'Keshi is throwing a party',
            totalacceptedsubmissions: 3002,
            accuracy: 80.90
        },
        {
            srno: 1,
            problemtitle: 'Keshi is throwing a party',
            totalacceptedsubmissions: 3002,
            accuracy: 80.90
        },
        {
            srno: 1,
            problemtitle: 'Keshi is throwing a party',
            totalacceptedsubmissions: 3002,
            accuracy: 80.90
        },
        {
            srno: 1,
            problemtitle: 'Keshi is throwing a party',
            totalacceptedsubmissions: 3002,
            accuracy: 80.90
        }
    ];

    return (
        <div className={styles.container}>
            <Problempagenavbar/>
            
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.problemlistheader}>
                        <p className={styles.srno}>Sr. No.</p>
                        <p className={styles.problemtitle}>Problem Name</p>
                        <p className={styles.submissions}>Submissions</p>
                        <p className={styles.accuracy}>Accuracy</p>
                    </div>
                    
                    <div className={styles.problemtable}>
                        {
                            problems.map((problem, index) => (
                                <div key={index} className={styles.problemrow}>
                                    <p className={styles.srnox}>{problem.srno}</p>
                                    <p className={styles.problemtitlex}>{problem.problemtitle}</p>
                                    <p className={styles.submissionsx}>{problem.totalacceptedsubmissions}</p>
                                    <p className={styles.accuracyx}>{problem.accuracy}%</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                
                <div className={styles.right}>
                    <div className={styles.contestinfo}>
                        <img src={contestimage} className={styles.contestimg} alt="Contest" />
                        <div className={styles.contestname}>
                            <p >{ContestName}</p>
                        </div>
                    </div>
                    <div className={styles.timer}>
                        <p className={styles.timertext}>Contest will end in</p>
                        <p className={styles.time}>{toendtime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contestproblempage;