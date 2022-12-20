import React from 'react';
import './Inductions.css';

const Overview = (props) => {
  console.log('props',props);
  const title = props.c.title;
  const overview = props.c.description;
  return (
    <>
      <div className='overview-container'>
        <h5>Overview</h5>
        This is {title} Overview Tab
      </div>
    </>
  )
}

export default Overview;