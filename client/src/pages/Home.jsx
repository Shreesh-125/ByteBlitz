import React from 'react'
import Announcements from '../ui/Announcements'
import styles from '../styles/Home.module.css'
import Homesidebar from './Homesidebar'
import {Link} from "react-router-dom"
import { Route, Routes, useParams } from "react-router-dom";
import Particularblog from './Particularblog'
const Home = () => {
  return (
    <div className={styles.home}>
      <Announcements />
      <Homesidebar/>
    </div>
  )
}

export default Home