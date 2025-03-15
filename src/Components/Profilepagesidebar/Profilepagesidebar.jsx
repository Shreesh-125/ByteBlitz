import React from 'react'
import Ratinginfo from '../Ratinginfo/Ratinginfo'
import Recentsubmissions from '../Recentsubmissions/Recentsubmissions'
import styles from './Profilepagesidebar.module.css'
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