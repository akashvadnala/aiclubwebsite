import React from 'react';
import './Projects.css';
import ProjectSpace from './ProjectSpace';

const Projects = () => {
  const projects=[
    {
      'title':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash',
      'url':'projects?title=multi-task-learning-for-self-driving-cars'
    },
    {
      'title':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash',
      'url':'projects?title=multi-task-learning-for-self-driving-cars'
    },
    {
      'title':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash',
      'url':'projects?title=multi-task-learning-for-self-driving-cars'
    },
    {
      'title':'Multi Task Learning for Self-Driving Cars',
      'text':'Multi task learning is an effective approach in which multiple tasks are simultaneously learned by a shared model. Such approaches offer advantages like improved data efficiency, reduced overfitting through shared representations, and fast learning by leveraging auxiliary information. Using this MTL model we are able to generate depth , segmentation maps and perform object detection using a single encoder-multi decoder network on Indian Roads.',
      'authors':'Bhanu Prakash',
      'url':'projects?title=multi-task-learning-for-self-driving-cars'
    }
  ]
  return (
    <>
      <div className='project-container'>
          <div className='adjust'>
              <h2>Projects</h2>
              <div className='row'>
                {
                  projects.map((project)=>{
                    return(
                      <ProjectSpace title={project.title} text={project.text} authors={project.authors} url={project.title} />
                    )
                  })
                }
              </div>
          </div>
      </div>
    </>
  )
}

export default Projects