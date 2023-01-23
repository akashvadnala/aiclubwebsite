import React, { useEffect, useState } from 'react';
import './ProjectsHome.css';
import ProjectCardHome from './ProjectCardHome';
import { NavLink } from 'react-router-dom';
import { SERVER_URL } from '../../../../EditableStuff/Config';
import axios from 'axios';

const ProjectsHome = () => {
  const proj = [
    {
      'name':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash, Sai Manoj',
      'url':'/projects?title=multi-task-learning-for-self-driving-cars'
    },
    {
      'name':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash, Sai Manoj',
      'url':'/projects?title=multi-task-learning-for-self-driving-cars'
    },
    {
      'name':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash, Sai Manoj',
      'url':'/projects?title=multi-task-learning-for-self-driving-cars'
    }
  ];
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