import React from 'react';
import './Inductions.css';
import InductionsHeader from './InductionsHeader';

const Overview = (props) => {
  const title = props.title;
  return (
    <>
      {
        <div className='data-container'>
          This is {title} Data Tab
      </div>
      }
    </>
  )
}

export default Overview;