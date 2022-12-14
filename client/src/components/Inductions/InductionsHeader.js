import React from 'react'
import { NavLink } from 'react-router-dom'

const InductionsHeader = (props) => {
  console.log('props',props);
  const url = props.c.url;
  const navs = props.c.navs;
  const keys = Object.keys(navs);
  console.log('keys',keys);
  return (
    <>
        <h3>{props.c.title}</h3>
        <div className='inductions-navbar'>
          <div><NavLink to={`/${url}`}>Overview</NavLink></div>
          {
            keys.map(m => {
              return(
                <div><NavLink to={`/${url}/${m}`}>{navs[m]}</NavLink></div>
              )
            })
          }
          {/* <div><NavLink to='/inductions-b21-b20'>Overview</NavLink></div>
          <div><NavLink to='/inductions-b21-b20/data'>Data</NavLink></div>
          <div><NavLink to='/inductions-b21-b20/leaderboard'>Leaderboard</NavLink></div>
          <div><NavLink to='/inductions-b21-b20/register'>Register</NavLink></div> */}
        </div>
    </>
  )
}

export default InductionsHeader