import React from 'react';
import './ProjectsHome.css';
import ProjectCardHome from './ProjectCardHome';
import { NavLink } from 'react-router-dom';

const ProjectsHome = () => {
  const projects = [
    {
      'name':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash, Sai Manoj'
    },
    {
      'name':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash, Sai Manoj'
    },
    {
      'name':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash, Sai Manoj'
    }
  ]
  return (
      <div className='projects-home-container'>
        <h3 className='header'>Projects</h3>
          {
            projects.map((project)=>{
              return(
                <ProjectCardHome name={project.name} text={project.text} authors={project.authors} />
              )
            })
          }
        <p><NavLink to='/projects'>Know More About Projects<span className='small'> ❯</span></NavLink></p>
      </div>
  )
}

export default ProjectsHome