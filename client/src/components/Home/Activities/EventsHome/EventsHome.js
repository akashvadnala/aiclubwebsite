import React from 'react';
import EventCardHome from './EventCardHome';
import { NavLink } from 'react-router-dom';

const EventsHome = ({events}) => {

    return (
            <div className='events-home-container'>
                <h4 className='header'>Events</h4>
                {
                  events && events.map((event,i)=>{
                    return(
                        <EventCardHome event={event} key={i}/>
                    )
                    })
                }

                <p className='h6 pt-3'><NavLink to='/events'>Know More About Events<span className='small'> ❯</span></NavLink></p>
            </div>
    )
}

export default EventsHome