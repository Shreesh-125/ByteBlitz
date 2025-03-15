import React from 'react'
import styles from "./Upcomingcontest.module.css"
import contestImage from "../../assets/contest.png"

const Upcomingcontest = () => {
  return (
    <div className={styles.container}>
        <div className={styles.heading}>
            Upcoming Contest
        </div>
        <div className={styles.aboutContest}>
            <img src={contestImage} alt="contest" />
            <div className={styles.contestInformation}>
                <h2>BB Challenge #1</h2>
                <p>23:02:01</p>
                <h3>Register now</h3>
            </div>
        </div>  
    </div>
  )
}

export default Upcomingcontest