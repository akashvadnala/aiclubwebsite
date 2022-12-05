import React from 'react';
import EventCardHome from './EventCardHome';
import { NavLink } from 'react-router-dom';

const EventsHome = () => {
    const events=[
        {
            'name':'A 3 Day All India Workshop on Generative Adversarial Networks'
        },
        {
            'name':'Dr. Aditya Bhaskara on “How ML has changed computing'
        },
        {
            'name':'Dr. S M Mizanoor Rahman on “The need of AI in robotics for Rehabilitation'
        },
        {
            'name':'Dr. Ayush Jaiswal on “Class-Agnostic Object Detection'
        },
        {
            'name':'Mr. Raghav Mani on “AI in Healthcare and Life Science'
        },
        {
            'name':'Mr.Syed Shahnawazuddin on “The Basics of X-Vector-Based Automatic Speaker Verification'
        }
    ]
  return (
        <div className='events-home-container'>
            <h4 className='header'>Events</h4>
            {
                events.map((e)=>{
                return(
                    <EventCardHome event={e.name} />
                )
                })
            }
            <p><NavLink to='/events'>Know More About Events<span className='small'> ❯</span></NavLink></p>
        </div>
  )
}

export default EventsHome