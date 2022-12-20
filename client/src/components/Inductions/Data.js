import React from 'react';
import './Inductions.css';

const Data = (props) => {
  const title = props.c.title;
  const info = props.c.description;
  return (
    <>
      <div className='data-container'>
        This is {title} Data Tab
        <h4>Data</h4>
        <p>{info}</p>
      </div>
    </>
  )
}

export default Data;