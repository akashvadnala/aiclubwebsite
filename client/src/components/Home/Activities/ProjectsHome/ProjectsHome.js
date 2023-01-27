import React, { useEffect, useState } from 'react';
import './ProjectsHome.css';
import ProjectCardHome from './ProjectCardHome';
import { NavLink } from 'react-router-dom';
import { SERVER_URL } from '../../../../EditableStuff/Config';
import axios from 'axios';

const ProjectsHome = () => {
  const [ projects, setProjects ] = useState([]);
  const getProjects = () => {
    try{
      axios.get(`${SERVER_URL}/getthreeprojects`)
      .then(data=>{
        setProjects(data.data);
      })
    }catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{
    getProjects();
  },[]);
  return (
      <div className='projects-home-container'>
        <h4 className='header'>Projects</h4>
          {
            projects.map((project)=>{
              return(
                <ProjectCardHome project={project} />
              )
            })
          }
          <br></br>
        <p className='h6'><NavLink to='/projects'>Know More About Projects<span className='small'> ❯</span></NavLink></p>
      </div>
  )
}

export default ProjectsHome