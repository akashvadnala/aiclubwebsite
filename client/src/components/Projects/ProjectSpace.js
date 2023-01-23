import { NavLink } from "react-router-dom";
import { Fragment } from "react";

const ProjectSpace = ({project}) => {

  return (
      <div className='card'>
        <img src={project.cover} alt={project.title} className="card-img-top" />
        <div className="card-body text-center">
          <h5 className="card-title">{project.title}</h5>
          <p className="card-text text-muted">
            By
            {
              project.authors.map((author,i)=>{
                return(
                  <Fragment key={i}>
                    &nbsp;{author},
                  </Fragment>
                )
              })
            }
          </p>
          <NavLink rel="noreferrer" to={`/projects/${project.url}`} className="btn btn-sm btn-dark">Read More</NavLink>
        </div>
      </div>
  )
}

export default ProjectSpace;