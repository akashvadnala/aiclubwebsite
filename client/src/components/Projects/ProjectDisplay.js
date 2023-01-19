import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../Context/Context";
import { SERVER_URL } from "../../EditableStuff/Config";
import Error from "../Error";
import Loading from "../Loading";
import AuthorCard from "./AuthorCard";
import { NavLink } from "react-router-dom";
import Tag from "../Blogs/tags/Tag";

const ProjectDisplay = () => {
  const { url } = useParams();
  const { user } = useContext(Context);
  var project = null;
  const [proj, setProj] = useState();
  const [authors, setAuthors] = useState([]);
  const [load, setLoad] = useState(0);
  const [edit, setEdit] = useState(false);

  const navigate = useNavigate();

    const getProject = async () =>{
        try{
            const data = await axios.get(`${SERVER_URL}/getProject/${url}`)
            console.log('project',data.data.project);
            if(data.status!==200){
                setLoad(-1);
                return;
            }
            project=data.data.project;
            if(user && data.data.project.authors.indexOf(user.username)>-1){
                setEdit(true);
            }
            setProj(data.data.project);
            setAuthors(data.data.authors);
            setLoad(1);
        }catch(err){
            console.log(err);
        }
        
    }
    
    useEffect(()=>{
        getProject();
    },[user])


  const deleteProject = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      `Are you sure to delete the project "${proj.title}"?`
    );
    if (confirmed) {
      const res = await axios.post(`${SERVER_URL}/deleteProject/${proj.url}`);
      if (res.status === 200) {
        navigate("/projects");
      } else {
        console.log("Project Cannot be deleted");
      }
    }
  };
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container projectdisplay-container py-5">
          <div className="row">
            <div className="col-lg-8 px-5">
              <div className="header align-center">
                <h3 className="text-center pb-1">{proj.title}</h3>
                {edit && (
                  <div className="text-center fs-6 p-2">
                    <NavLink
                      to={`/projects/${proj.url}/edit`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit{" "}
                    </NavLink>
                    ·
                    <NavLink
                      rel="noreferrer"
                      onClick={deleteProject}
                      className="btn btn-danger btn-sm"
                    >
                      {" "}
                      Delete
                    </NavLink>
                  </div>
                )}
                {proj.tags && (
                  <div className="text-center mb-2" style={{'display': 'flex', 'justifyContent': 'center'}}>
                    {proj.tags.map((t, i) => {
                      {
                        return (
                          <div key={i}>
                            <Tag label={t} />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <p dangerouslySetInnerHTML={{ __html: proj.content }}></p>
            </div>
            <div className="col-lg-4">
              {authors.map((a) => {
                return (
                  <>
                    <AuthorCard a={a} />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default ProjectDisplay;
