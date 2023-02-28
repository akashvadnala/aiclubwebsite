import React from 'react';
import logo from './empty.gif'

const EmptyList = () => (
  <div className='emptyList-wrap'>
    <img src={logo} alt='empty' style={{width:"70vw",height:"70vh"}} />
  </div>
);

export default EmptyList;