import React from 'react';
import './Inductions.css';

const Data = (props) => {
  const title = props.title;
  const info = props.info;
  const path = props.path;
  return (
    <>
      <div className='data-container'>
        This is {title} 
        <h4>{path}</h4>
        <p>{info}</p>
      </div>
    </>
  )
}

export default Data;