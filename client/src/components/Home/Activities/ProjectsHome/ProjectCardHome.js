import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../EventsHome/EventHome.css';
import 'html-to-text'
import { SERVER_URL } from '../../../../EditableStuff/Config';
import axios from 'axios';

const ProjectCardHome = ({project}) => {
  const [names,setNames] = useState("");
  
  const getFirstLastNameForProjects = async () => {
      axios.get(`${SERVER_URL}/getFirstLastNameForProjects/${project.url}`)
      .then(data=>{ setNames(data.data); });
  }

  useEffect(()=>{
    if(project){
      getFirstLastNameForProjects();
    }
  },[project]); 

  return (
        <div className='project-card-home-container mt-3'>
          <div class='title-box'>
            <h5 className='project-title'><NavLink to={`/projects/${project.url}`} className="text-dark">{project.title}</NavLink></h5>
          </div>
          <div className='speakers text-secondary'>
            <p>by {names} </p>
            {/* <NavLink to={`/projects/${project.url}`}><p>Learn More<span className='small'> ❯</span></p></NavLink> */}
          </div>
        </div>
  )
}

export default ProjectCardHome