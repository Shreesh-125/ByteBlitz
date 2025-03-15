import React from 'react'
import styles from '../styles/CodeResults.module.css'

const CodeResults = ({ customInput, setCustomInput, yourOutput, isExecuted, isSuccess }) => {
  return (
    <div className={styles.resultsContainer}>
      {
        isExecuted &&
        (
          <div className={styles.codeStatus}>
            <p>Status:</p> Successfully Executed
          </div> 
        )
      }
      <div className={styles.customInput}>
        <span>Enter your Custom Input</span>
        <textarea type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} />
      </div>
      {
        isExecuted &&
        (
          <div className={styles.customOutput}>
            <span>{isSuccess ? "Your Output" : "Error"}</span>
            <input type="text" value={yourOutput} />
          </div>
        )
      }
    </div>
  )
}

export default CodeResults