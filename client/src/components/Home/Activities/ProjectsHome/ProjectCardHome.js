import React from 'react';
import { NavLink } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import 'html-to-text'

const ProjectCardHome = ({project}) => {
  const content = <p dangerouslySetInnerHTML={{ __html: project.content }}></p>
//   const content = htmlToText(project.content, {
//     wordwrap: 15
// });
  console.log('projects3',content);
  return (
        <div className='project-card-home-container mt-3'>
          <div id='title'>
            <h5>{project.title}</h5>
          </div>
          {/* <TextTruncate line={2} element="p" truncateText='...' text={content} textTruncateChild={<NavLink to={`/projects/${project.url}`}>Learn More</NavLink>} /> */}
          <div className='speakers'>
            <p>by {project.authors.join(',')} </p>
            <NavLink to={`/projects/${project.url}`}><p>Learn More<span className='small'> ❯</span></p></NavLink>
          </div>
        </div>
  )
}

export default ProjectCardHome