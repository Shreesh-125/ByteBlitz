import React from 'react'
import styles from "../styles/ProblemSubmission.module.css"
import { Loader2 } from 'lucide-react'
import tickIcon from '../assets/tick.svg'
import crossIcon from '../assets/cross.svg'

const ProblemSubmission = ({ hasSubmitted }) => {
  return (
    <div className={styles.problemSubmission}>
      <div className={styles.problemStatus}>
        <p>{
          hasSubmitted === "pending" ?
            "Checking solution against test cases..." :
            hasSubmitted === "accepted" ?
              "Accepted: Your solution is correct." :
              hasSubmitted === "wrong" ?
                "Wrong Answer: Oops! Your output didn’t match." :
                "Some error occured"
        }</p>
        {
          hasSubmitted === "pending" ?
            <Loader2 className={styles.spinner} size={20} color="blue" /> :
            hasSubmitted === "accepted" ?
              <img src={tickIcon} alt="tick" className={styles.icon} /> :
              <img src={crossIcon} alt="cross" className={styles.icon} />
        }
      </div>
      <div className={styles.problemSubmissionInfo}>
        {
          hasSubmitted === "pending" ?
            "" : (
              <>
                <div className={styles.infoItem}>
                  <p>TestCases</p>
                  <p>0/6</p>
                </div>
                <div className={styles.infoItem}>
                  <p>Time</p>
                  <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                  <p>Memory</p>
                  <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                  <p>TestCases</p>
                  <p>0/6</p>
                </div>
              </>
            )
        }
      </div>
    </div>
  )
}

export default ProblemSubmission