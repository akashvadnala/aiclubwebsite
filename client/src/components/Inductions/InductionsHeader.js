import React from 'react'
import { NavLink } from 'react-router-dom'

const InductionsHeader = ({url,title,description}) => {
  const keys = {
    '':'Overview',
    'data':'Data',
    'leaderboard':'Leaderboard',
    'submissions':'Submissions',
    'register':'Register',
  }
  return (
    <>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className='inductions-navbar'>
          {
            Object.entries(keys).map(([key, value]) => {
              return(
                <div><NavLink to={`/competitions/${url}/${key}`}>{value}</NavLink></div>
              )
            })
          }
        </div>
    </>
  )
}

export default InductionsHeader