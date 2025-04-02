import React, { useEffect } from 'react'
import styles from '../styles/CodeResults.module.css'
import SmallLoader from '../ui/smallLoader'

const CodeResults = ({ customInput, setCustomInput, yourOutput, isExecuted, isSuccess }) => {
  useEffect(()=>{
  },[isExecuted])
  return (
    <div className={styles.resultsContainer}>
      {
        isExecuted !== null &&
        (
          isExecuted === true ?
          
          <div className={styles.codeStatus}>
            <p>Status:</p> {isSuccess?"Successfully Executed":"Some error occured"}
          </div> :
          <SmallLoader/>
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