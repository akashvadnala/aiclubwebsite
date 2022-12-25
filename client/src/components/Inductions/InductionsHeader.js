import React from 'react'
import { NavLink } from 'react-router-dom'

const InductionsHeader = (props) => {
  let keys = {
    '':'Overview',
    'data':'Data',
    'leaderboard':'Leaderboard',
    'submissions':'Submissions',
    'register':'Register',
  }
  if(props.access){
    keys = {
      'host':'Host',
      '':'Overview',
      'data':'Data',
      'leaderboard':'Leaderboard',
      'submissions':'Submissions',
      'register':'Register',
    }
  }
  return (
    <>
        <h3>{props.c.title}</h3>
        <p>{props.c.description}</p>
        <div className='inductions-navbar'>
          {
            Object.entries(keys).map(([key, value]) => {
              return(
                <div><NavLink to={`/competitions/${props.c.url}/${key}`}>{value}</NavLink></div>
              )
            })
          }
        </div>
    </>
  )
}

export default InductionsHeader