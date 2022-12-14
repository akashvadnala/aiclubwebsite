import React from 'react';
import './Inductions.css';
import InductionsHeader from './InductionsHeader';

const Overview = (props) => {
  const title = props.title;
  return (
    <>
      {
        <div className='overview-container'>
          This is {title} Overview Tab
      </div>
      }
    </>
  )
}

export default Overview;