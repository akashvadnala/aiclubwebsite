import React from 'react';
import './ProjectsHome.css';
import ProjectCardHome from './ProjectCardHome';
import { NavLink } from 'react-router-dom';

const ProjectsHome = ({projects}) => {
  return (
      <div className='projects-home-container'>
        <h4 className='header'>PROJECTS</h4>
          {
            projects && projects.map((project)=>{
              return(
                <ProjectCardHome project={project} />
              )
            })
          }
        <p className='h6 pt-3'><NavLink to='/projects'>Know More About Projects<span className='small'> ❯</span></NavLink></p>
      </div>
  )
}

export default ProjectsHome