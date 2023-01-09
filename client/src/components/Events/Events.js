import React from 'react';
import EventSpace from './EventSpace';
import axios from 'axios';

const events=[
    {
        'text':'A 3 Day All India Workshop on Generative Adversarial Networks',
        'date':'01-01-2022'
    },
    {
        'text':'Dr. Aditya Bhaskara on How ML has changed computing',
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

const Events = () => {
  
  return (
      <div className='events-container'>
          <div className='adjust'>
              <h1>upcoming Events</h1>
                
              <h1>Past Events</h1>
          </div>
      </div>
  )
}

export default Events