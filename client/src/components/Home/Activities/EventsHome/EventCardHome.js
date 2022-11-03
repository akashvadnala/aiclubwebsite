import React from 'react';

const EventCardHome = ({event}) => {
  return (
      <div className='event-card-home-container mt-3'>
          <p>{event}</p>
      </div>
  )
}

export default EventCardHome