import React from 'react';

const EventSpace = ({event}) => {
  return (
      <div className='col-xs-12'>
        {event.text},{event.date}
      </div>
  )
}

export default EventSpace;