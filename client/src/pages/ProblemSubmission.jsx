import React from 'react'
import styles from "../styles/ProblemSubmission.module.css"
import { Loader2 } from 'lucide-react'
import tickIcon from '../assets/tick.svg'
import crossIcon from '../assets/cross.svg'

const ProblemSubmission = ({ hasSubmitted,submission }) => {
 
  const statusMessages = {
    "pending": "Checking solution against test cases...",
    "accepted": "Accepted: Your solution is correct.",
    "Wrong Answer": "Wrong Answer: Oops! Your output didn't match.",
    "Time Limit Exceeded": "Time Limit Exceeded: Your solution took too long to execute.",
    "Compilation Error": "Compilation Error: Your code failed to compile.",
    "Runtime Error": "Runtime Error: Your code crashed during execution.",
    "internal server error": "Internal Server Error: Please try again later.",
    "Execution Time Limit Exceeded": "Execution Time Limit Exceeded: Your solution took too long to run.",
    "Memory Limit Exceeded (MLE)": "Memory Limit Exceeded: Your solution used too much memory."
  };
  return (
    <div className={styles.problemSubmission}>
      <div className={styles.problemStatus}>
      <p>{statusMessages[hasSubmitted] || "Runtime Error: An unexpected error occurred."}</p>
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
                  <p>Time</p>
                  <p>{submission.time? submission.time:"N/A"} s</p>
                </div>
                <div className={styles.infoItem}>
                  <p>Memory</p>
                  <p>{submission.memory? submission.memory:"N/A"} KB</p>
                </div>
                <div className={styles.infoItem}>
                  <p>TestCases</p>
                  <p>{submission?.message==="accepted"? submission?.totalTestCase: submission.WrongOnTestCase}/{submission?.totalTestCase}</p>
                </div>
              </>
            )
        }
      </div>
    </div>
  )
}

export default ProblemSubmission