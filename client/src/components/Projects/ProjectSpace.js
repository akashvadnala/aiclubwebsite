import { NavLink } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";

const ProjectSpace = ({project}) => {
  const [names,setNames] = useState("");
  const getFirstLastNameForProjects = async () => {
      axios.get(`${SERVER_URL}/getFirstLastNameForProjects/${project.url}`)
      .then(data=>{
        if(data.status===200){
          setNames(data.data);
        }
      });
  }
  useEffect(()=>{
    if(project){
      getFirstLastNameForProjects();
    }
  },[project]);
  
  return (
      <div className='card'>
        <img src={project.cover} alt={project.title} className="card-img-top" />
        <div className="card-body text-center">
          <h5 className="card-title">{project.title}</h5>
          <p className="card-text text-muted">
            By {names}
          </p>
          <NavLink rel="noreferrer" to={`/projects/${project.url}`} className="btn btn-sm btn-dark">Read More</NavLink>
        </div>
      </div>
  )
}

export default ProjectSpace;