import React from 'react';
import EventsHome from './EventsHome/EventsHome';
import ProjectsHome from './ProjectsHome/ProjectsHome';
import './Activities.css'

const Activities = ({events, projects}) => {
  return (
      <div className='activities-container pt-5 pb-1 adjust'>
          <div className='row'>
              <h3 className='text-center pb-3'>ACTIVITIES</h3>
              <div className='col-md-6 col-xs-12 pb-4 pr-2'>
                <EventsHome events={events} />
              </div>
              <div className='col-md-6 col-xs-12 pb-4 pl-2'>
                <ProjectsHome projects={projects} />
              </div>
          </div>
      </div>
  )
}

export default Activities