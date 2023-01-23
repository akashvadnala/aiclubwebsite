import React from 'react';
import { NavLink } from 'react-router-dom';
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
            <p>by {event.speakers.join(',')} </p>
            <NavLink to={"events/"+event.url}><p>Learn more<span className='small'> ❯</span></p></NavLink>
          </div>
          
      </div>
  )
}

export default EventCardHome