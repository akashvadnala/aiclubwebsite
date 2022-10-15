import React from 'react';
import TextTruncate from 'react-text-truncate';

const ProjectCardHome = props => {
  return (
    <>
        <div className='col-lg-6 col-md-12'>
            <div className='card'>
                <h5 className='card-title'>{props.name}</h5>
                <TextTruncate line={4} element="p" truncateText='...' text={props.text} textTruncateChild={<a href='/'>Know More</a>} />
                <p>
                    <span>-{props.authors}</span>
                </p>
            </div>
        </div>
    </>
  )
}

export default ProjectCardHome