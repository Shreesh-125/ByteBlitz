import React from 'react'
import styles from '../styles/Allsubmissionpage.module.css'
const Allsubmissionpage = () => {
    const probleminfo = [{
        when: {
            date:'2023-10-01',
            time: '14:30'
        },
        question: 'Two Sum',
        status: true,
        runtime: '2ms',
        language: 'Python'
    },
    {
        when: {
            date:'2023-10-01',
            time: '14:30'
        },
        question: 'Two Sum',
        status: false,
        runtime: '2ms',
        language: 'Python'
    },
    {
        when: {
            date:'2023-10-01',
            time: '14:30'
        },
        question: 'Two Sum',
        status: false,
        runtime: '2ms',
        language: 'Python'
    },
    {
        when: {
            date:'2023-10-01',
            time: '14:30'
        },
        question: 'Two Sum',
        status: false,
        runtime: '2ms',
        language: 'Python'
    },
    {
        when: {
            date:'2023-10-01',
            time: '14:30'
        },
        question: 'Two Sum',
        status: false,
        runtime: '2ms',
        language: 'Python'
    },
    {
        when: {
            date:'2023-10-01',
            time: '14:30'
        },
        question: 'Two Sum',
        status: true,
        runtime: '2ms',
        language: 'Python'
    },
    {
        when: {
            date:'2023-10-01',
            time: '14:30'
        },
        question: 'Two Sum',
        status: true,
        runtime: '2ms',
        language: 'Python'
    }]
    return (
        <div className={styles.container}>
            <div className={styles.pagetitle}>
                <p>All My Submissions</p>
            </div>
            <div className={styles.table}>
                <div className={styles.header}>
                    <p className={styles.headertimesubmitted}>TimeSubmitted</p>
                    <p className={styles.headerquestion}>Question</p>
                    <p className={styles.headerstatus}>Status</p>
                    <p className={styles.headerruntime}>Runtime</p>
                    <p className={styles.headerlanguage}>Language</p>
                </div>
                <div className={styles.list}>
                    <ul>
                        {probleminfo.map(({when, question, status, runtime, language}, index) => (
                            <li key={index} className={styles.listitem}>
                                <div className={styles.when}>
                                    <p className={styles.date}>{when.date}</p>
                                    <p className={styles.time}>{when.time}</p>
                                </div>
                                <p className={styles.question}>{question}</p>
                                <p className={`${styles.status} ${status ? styles.accepted : styles.rejected}`}>
                                    {status ? "Accepted" : "Rejected"}
                                </p>

                                <p className={styles.runtime}>{runtime}</p>
                                <p className={styles.runtime}>{language}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Allsubmissionpage