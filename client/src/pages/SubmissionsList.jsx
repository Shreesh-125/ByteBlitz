import React from 'react'
import styles from "../styles/SubmissionsList.module.css"
import { Loader2 } from 'lucide-react'
import tickIcon from '../assets/tick.svg'
import crossIcon from '../assets/cross.svg'

const SubmissionList = ({ hasSubmitted }) => {
    return (
        <div className={styles.problemSubmissions}>
            <div className={styles.problemSubmissionHeader}>
                <div className={styles.headerItem}>
                    <span>Submission</span>
                </div>
                <div className={styles.headerItem}>
                    <span>Status</span>
                </div>
                <div className={styles.headerItem}>
                    <span>Time</span>
                </div>
                <div className={styles.headerItem}>
                    <span>Memory</span>
                </div>
                <div className={styles.headerItem}>
                    <span>Language</span>
                </div>
            </div>
            <div className={styles.problemSubmissionInfo}>
                <div className={styles.infoItem}>
                    <p>Click Here</p>
                </div>
                <div className={styles.infoItem}>
                    <img src={tickIcon} alt="" className={styles.icon} />
                </div>
                <div className={styles.infoItem}>
                    
                    <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                    
                    <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                    <p>C++</p>
                </div>
            </div>
            <div className={styles.problemSubmissionInfo}>
                <div className={styles.infoItem}>
                    <p>Click Here</p>
                </div>
                <div className={styles.infoItem}>
                    <img src={tickIcon} alt="" className={styles.icon} />
                </div>
                <div className={styles.infoItem}>
                    
                    <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                    
                    <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                    <p>C++</p>
                </div>
            </div>
            <div className={styles.problemSubmissionInfo}>
                <div className={styles.infoItem}>
                    <p>Click Here</p>
                </div>
                <div className={styles.infoItem}>
                    <img src={crossIcon} alt="" className={styles.icon} />
                </div>
                <div className={styles.infoItem}>
                    
                    <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                    
                    <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                    <p>C++</p>
                </div>
            </div>
            <div className={styles.problemSubmissionInfo}>
                <div className={styles.infoItem}>
                    <p>Click Here</p>
                </div>
                <div className={styles.infoItem}>
                    <img src={crossIcon} alt="" className={styles.icon} />
                </div>
                <div className={styles.infoItem}>
                    
                    <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                    
                    <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                    <p>C++</p>
                </div>
            </div>
            <div className={styles.problemSubmissionInfo}>
                <div className={styles.infoItem}>
                    <p>Click Here</p>
                </div>
                <div className={styles.infoItem}>
                    <img src={crossIcon} alt="" className={styles.icon} />
                </div>
                <div className={styles.infoItem}>
                    
                    <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                    
                    <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                    <p>C++</p>
                </div>
            </div>
            <div className={styles.problemSubmissionInfo}>
                <div className={styles.infoItem}>
                    <p>Click Here</p>
                </div>
                <div className={styles.infoItem}>
                    <img src={crossIcon} alt="" className={styles.icon} />
                </div>
                <div className={styles.infoItem}>
                    
                    <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                    
                    <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                    <p>C++</p>
                </div>
            </div>
            <div className={styles.problemSubmissionInfo}>
                <div className={styles.infoItem}>
                    <p>Click Here</p>
                </div>
                <div className={styles.infoItem}>
                    <img src={crossIcon} alt="" className={styles.icon} />
                </div>
                <div className={styles.infoItem}>
                    
                    <p>0.3s</p>
                </div>
                <div className={styles.infoItem}>
                    
                    <p>400KB</p>
                </div>
                <div className={styles.infoItem}>
                    <p>C++</p>
                </div>
            </div>
            
        </div>
    )
}

export default SubmissionList