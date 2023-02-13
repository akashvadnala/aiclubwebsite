import React from 'react';
import EventsHome from './EventsHome/EventsHome';
import ProjectsHome from './ProjectsHome/ProjectsHome';

const Activities = ({events, projects}) => {
  return (
      <div className='activities-container py-5 adjust'>
          <div className='row'>
              <h3 className='text-center pb-3'>Activities</h3>
              <div className='col-md-6 col-xs-12'>
                <EventsHome events={events} />
              </div>
              <div className='col-md-6 col-xs-12'>
                <ProjectsHome projects={projects} />
              </div>
          </div>
      </div>
  )
}

export default Activities