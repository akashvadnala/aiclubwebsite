import React from 'react';
import './Inductions.css';

const Overview = (props) => {
  const title = props.c.title;
  const overview = props.c.overview;
  return (
    <>
      <div className='overview-container'>
        This is {title} Overview Tab
        <h4>Overview</h4>
        <p>{overview}</p>
      </div>
    </>
  )
}

export default Overview;