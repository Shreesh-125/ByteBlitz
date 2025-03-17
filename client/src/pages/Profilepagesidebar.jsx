import React from 'react'
import Ratinginfo from '../ui/Ratinginfo'
import Recentsubmissions from '../ui/Recentsubmissions'
import styles from '../styles/Profilepagesidebar.module.css'
const Profilepagesidebar = () => {
    console.log('hi there');
  return (
    <div className={styles.profilepagesidebar}>
        <Ratinginfo/>
        <Recentsubmissions/>
    </div>
  )
}

export default Profilepagesidebar