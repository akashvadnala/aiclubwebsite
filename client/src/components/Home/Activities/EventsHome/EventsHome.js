import React from 'react';
import EventCardHome from './EventCardHome';

const EventsHome = () => {
    const events=[
        {
            'name':'GAN Workshop'
        },
        {
            'name':'GAN Workshop'
        },
        {
            'name':'GAN Workshop'
        },
        {
            'name':'GAN Workshop'
        }
    ]
  return (
    <>
        <div className='events-home-container'>
            <h3 className='header'>Events</h3>
            {
                events.map((event)=>{
                return(
                    <EventCardHome />
                )
                })
            }
            {/* <p><NavLink to='/projects'>Know More About Projects<span className='small'> ❯</span></NavLink></p> */}
        </div>
    </>
  )
}

export default EventsHome