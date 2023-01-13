import React from 'react';
import './EventHome.css'
import { useNavigate } from "react-router-dom";

const EventCardHome = ({event}) => {
  let navigate = useNavigate();
  return (
      <div className='event-card-home-container mt-3'>
          <h5>{event.title} </h5>
          <div className='speakers'>
            <p>By - {event.speakers} </p>
            <button type="button" className="button" onClick={()=>{navigate("/events/"+event.url);}}> - {event.status}</button>
          </div>
          
      </div>
  )
}

export default EventCardHome