import React from 'react';
import TextTruncate from 'react-text-truncate';

const ProjectCardHome = props => {
  return (
        <div className='project-card-home-container mt-3'>
          <h5>{props.name}</h5>
          <TextTruncate line={2} element="p" truncateText='...' text={props.text} textTruncateChild={<a href={props.url}>Learn More</a>} />
        </div>
  )
}

export default ProjectCardHome