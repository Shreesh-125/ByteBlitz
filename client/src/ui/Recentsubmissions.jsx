import React from 'react'
import styles from '../styles//Recentsubmissions.module.css'
import wrong_icon from '../assets/wrong_icon.png'
import correct_icon from '../assets/correct_icon.png'

const Recentsubmissions = () => {
    const probleminfo = [
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: true
        },
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: false
        },
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: false
        },{
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: true
        },
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: false
        },
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: true
        },
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: true
        },
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: false
        },
        {
            when: {
                date: '11-02-25',
                time: '17:05'
            },
            problemname: 'Watermelon',
            lang: 'C++',
            solutionstatus: true
        }
    ];

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.title}>Recent Submissions</div>
                <div className={styles.table}>
                    <div className={styles.header}>
                        <p className={styles.when}>When</p>
                        <p className={styles.problem}>Problem</p>
                        <p className={styles.lang}>Lang</p>
                        <p className={styles.solution}>Solution</p>
                    </div>
                    <div className={styles.list}>
                        <ul>
                            {probleminfo.map(({ when, problemname, lang, solutionstatus }, index) => (
                                <li key={index} className={styles.listitem}>
                                    <div className={styles.datetime}>
                                        <p>{when.date}</p>
                                        <p>{when.time}</p>
                                    </div>
                                    <p>{problemname}</p>
                                    <p>{lang}</p>
                                    <img src={solutionstatus ? correct_icon : wrong_icon } className = {solutionstatus? styles.correct : styles.wrong } alt="solution status" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recentsubmissions;
