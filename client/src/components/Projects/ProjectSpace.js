import React from 'react';
import TextTruncate from 'react-text-truncate';

const ProjectSpace = ({title, text, authors, url}) => {
  return (
    <>
      <div className='col-xs-12'>
        <h5>{title}</h5>
        <TextTruncate line={2} element="p" truncateText='...' text={text} textTruncateChild={<a href='/'>Know More</a>} />
        <p>
            <span>-{authors}</span>
        </p>
        <hr />
      </div>
    </>
  )
}

export default ProjectSpace