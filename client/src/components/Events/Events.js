import React from 'react';
import EventSpace from './EventSpace';
// import './Events.css';
// import ProjectSpace from './ProjectSpace';

const Events = () => {
  const events=[
    {
        'text':'A 3 Day All India Workshop on Generative Adversarial Networks',
        'date':'01-01-2022'
    },
    {
        'text':'Dr. Aditya Bhaskara on “How ML has changed computing',
        'date':'01-01-2022'
    },
    {
        'text':'Dr. S M Mizanoor Rahman on “The need of AI in robotics for Rehabilitation',
        'date':'01-01-2022'
    },
    {
        'text':'Dr. Ayush Jaiswal on “Class-Agnostic Object Detection',
        'date':'01-01-2022'
    },
    {
        'text':'Mr. Raghav Mani on “AI in Healthcare and Life Science',
        'date':'01-01-2022'
    },
    {
        'text':'Mr.Syed Shahnawazuddin on “The Basics of X-Vector-Based Automatic Speaker Verification',
        'date':'01-01-2022'
    }
  ]
  return (
      <div className='events-container'>
          <div className='adjust'>
              <h3>Past Events</h3>
              <div className='row'>
                {
                  events.map((event)=>{
                    return(
                            <EventSpace event={event} />
                        )
                  })
                }
              </div>
          </div>
      </div>
  )
}

export default Events