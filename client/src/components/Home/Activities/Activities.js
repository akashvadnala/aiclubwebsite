import React from 'react';
import EventsHome from './EventsHome/EventsHome';
import ProjectsHome from './ProjectsHome/ProjectsHome';

const Activities = () => {
  return (
    <>
        <div className='activities-container adjust'>
            <div className='row'>
                <h2 className='text-center py-3'>Activities</h2>
                <div className='col-md-6 col-xs-12'>
                  <EventsHome />
                </div>
                <div className='col-md-6 col-xs-12'>
                  <ProjectsHome />
                </div>
            </div>
        </div>
    </>
  )
}

export default Activities