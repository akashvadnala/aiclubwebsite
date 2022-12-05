import React from 'react'
import InductionsHeader from './InductionsHeader';
import './Inductions.css';

const Inductions = () => {
  return (
    <div className='inductions-container'>
        <div className='adjust'>
            <InductionsHeader />
            <div className='inductions-body'>
                This is Overview Section
            </div>
        </div>
    </div>
  )
}

export default Inductions