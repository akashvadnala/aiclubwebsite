import React from 'react';
import { NavLink } from 'react-router-dom';
import './EventHome.css'

const EventCardHome = ({event}) => {
  return (
      <div className='event-card-home-container mt-3'>
        <div className='title-box'>
          <h5 className='event-title'><NavLink to={"events/"+event.url} className="text-dark">{event.title}</NavLink></h5>
          <p><span className="badge rounded-pill text-dark border border-dark">{event.status}</span></p>
        </div>
          {/* url - https://getbootstrap.com/docs/5.3/components/badge/ */}
          <div className='speakers text-secondary'>
            { event.speakers.length!==0 &&
                <p>by {event.speakers.join(',')} </p>
            }
            {/* <NavLink to={"events/"+event.url}><p>Learn more<span className='small'> ❯</span></p></NavLink> */}
          </div>
      </div>
  )
}

export default EventCardHome