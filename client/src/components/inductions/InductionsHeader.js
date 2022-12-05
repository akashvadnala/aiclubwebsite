import React from 'react'
import Overview from './Overview'

const InductionsHeader = () => {
  return (
    <>
        <h3>Inductions for B21 and B20</h3>
        <div className='inductions-navbar'>
            <div><a href='/inductions-b21-b20'>Overview</a></div>
            <div><a href='/inductions-b21-b20/data'>Data</a></div>
            <div><a href='/inductions-b21-b20/discussion'>Discussion</a></div>
            <div><a href='/inductions-b21-b20/leaderboard'>Leaderboard</a></div>
        </div>
    </>
  )
}

export default InductionsHeader