import React from 'react'
import styles from  '../styles/Homesidebar.module.css'
import Profileoverview from '../ui/Profileoverview'
import Usersearch from '../ui/Usersearch'
import Toprankings from '../ui/Toprankings'
import Upcomingcontest from '../ui/Upcomingcontest'
const Homesidebar = () => {
  return (
    <div className={styles.container}>
      <Upcomingcontest/>
      <Profileoverview/>
      <Usersearch/>
      <Toprankings/>
    </div>
  )
}

export default Homesidebar