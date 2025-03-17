import React from 'react'
import Conteststandingspagination from '../ui/Conteststandingspagination'
import Standings from '../ui/Standings'
import StandingsPageSearchBar from '../ui/StandingsPageSearchBar'
import Problempagenavbar from '../ui/Problempagenavbar'

const Conteststandingpage = () => {
  return (
    <div>
        <Problempagenavbar/>
        <StandingsPageSearchBar/>
        <Standings/>
    </div>
  )
}

export default Conteststandingpage