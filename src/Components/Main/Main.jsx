import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Announcements from '../Announcements/Announcements'
import './Main.css'

const Main = () => {
  return (
    <div className='main'>
        <Announcements/>
        <Sidebar/>
    </div>
  )
}

export default Main