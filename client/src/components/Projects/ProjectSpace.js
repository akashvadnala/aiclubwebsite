import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";

const ProjectSpace = ({project}) => {
  const d = new Date(project.createdAt);
  const ddmmyy = d.getDate() + "/" + String(parseInt(d.getMonth()) + 1) + "/" + d.getFullYear();
  const [names,setNames] = useState("");
  
  const getFirstLastNameForProjects = async () => {
      axios.get(`${SERVER_URL}/getFirstLastNameForProjects/${project.url}`)
      .then(data=>{ setNames(data.data); });
  }

  useEffect(()=>{
    if(project){
      getFirstLastNameForProjects();
    }
  },[project]);
  // prepare image src: accept absolute URL or id
  const getCoverSrc = () => {
    if (!project || !project.cover) return null;
    if (typeof project.cover === 'string' && (project.cover.startsWith('http://') || project.cover.startsWith('https://'))) {
      return project.cover;
    }
    return `${SERVER_URL.replace(/\/$/, '')}/getimg/${project.cover}`;
  }

  return (
      <div className='card'>
        <img src={getCoverSrc()} alt={project.title} className="card-img-top" />
        <div className="card-body text-center">
          <h5 className="card-title">{project.title}</h5>
          <p className="card-text text-muted">
            By {names} <br/> {ddmmyy}
          </p>
          <NavLink rel="noreferrer" to={`/projects/${project.url}`} className="btn btn-sm btn-dark">Read More</NavLink>
        </div>
      </div>
  )
}

export default ProjectSpace;