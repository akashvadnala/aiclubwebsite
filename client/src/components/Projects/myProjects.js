import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { SERVER_URL } from '../../EditableStuff/Config';
import './Projects.css';
import ProjectSpace from './ProjectSpace';
import Loading from '../Loading';
import Error from '../Error';
import { NavLink } from 'react-router-dom';
import { Context } from '../../Context/Context';

const Projects = () => {
  const {user} = useContext(Context);
  const [ projects, setProjects ] = useState([]);
  const [ load, setLoad ] = useState(0);
 
  const getMyProjects = () =>{
    try{
      axios.get(`${SERVER_URL}/getMyProjects/${user.username}`)
      .then(data=>{
        if(user && data.status===200){
          setProjects(data.data);
          setLoad(1);
        }
        else{
          setLoad(-1);
        }
      })
    }catch(err){
        setLoad(-1);
      console.log(err);
    }
  }

  useEffect(()=>{
    getMyProjects();
  },[user]);

  return (
    <>
    {load===0?<Loading />:load===1?
      <div className='project-container container'>
          <div>
            <div className='row py-4'>
              <div className='col-4'>
                <h2>My Projects</h2>
              </div>
              <div className='col-8 text-end'>
                {user?
                <>
                  <NavLink rel="noreferrer" to="/projects" className="btn btn-sm">All Projects</NavLink>&nbsp;&nbsp;
                  <NavLink rel="noreferrer" to="/addproject" className="btn btn-sm btn-success">+Add Project</NavLink>
                </>
                :null}
              </div>
            </div>
              <div className='row'>
                {
                  projects.map((project)=>{
                    return(
                      <div className='col-12 col-sm-6 col-lg-4 pb-5 px-3'>
                        <ProjectSpace project={project} />
                      </div>
                    )
                  })
                }
              </div>
          </div>
      </div>
      :<Error />}
    </>
  )
}

export default Projects