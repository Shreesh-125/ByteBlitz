import React from 'react'
import styles from  './Sidebar.module.css'
import Profileoverview from '../Profileoverview/Profileoverview'
import Usersearch from '../UserSearch/Usersearch'
import Toprankings from '../Toprankings/Toprankings'
import Upcomingcontest from '../Upcomingcontest/Upcomingcontest'
const Sidebar = () => {
  return (
    <div className={styles.container}>
      <Upcomingcontest/>
      <Profileoverview/>
      <Usersearch/>
      <Toprankings/>
    </div>
  )
}

export default Sidebar