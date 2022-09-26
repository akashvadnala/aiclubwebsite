import React from 'react';
import '../css/Projects.css';
import ProjectCard from './ProjectCard';

const Projects = () => {
  return (
    <>
      <div className='project-container'>
        <h2 className='header'>Our Projects</h2>
        <div className='row'>
          <ProjectCard name='Multi Task Learning for Self-Driving Cars' text='Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.' authors='Bhanu Prakash, Sai Manoj' />
          <ProjectCard name='Multi Task Learning for Self-Driving Cars' text='Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.' authors='Bhanu Prakash, Sai Manoj' />
          <ProjectCard name='Multi Task Learning for Self-Driving Cars' text='Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.' authors='Bhanu Prakash, Sai Manoj' />
        </div>
        <p><a href='/'>Know More About Projects<span className='small'> ❯</span></a></p>
      </div>
    </>
  )
}

export default Projects