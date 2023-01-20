import React from 'react';
import './EventHome.css'

const EventCardHome = ({event}) => {
  return (
      <div className='event-card-home-container mt-3'>
        <div id='title'>
          <h5>{event.title} </h5>
          <p><span className="badge rounded-pill text-bg-success">{event.status}</span></p>
        </div>
          {/* url - https://getbootstrap.com/docs/5.3/components/badge/ */}
          <div className='speakers'>
            <p>By - {event.speakers.join(',')} </p>
            <a href={"events/"+event.url}><p>Learn more</p></a>
          </div>
          
      </div>
  )
}

export default EventCardHome