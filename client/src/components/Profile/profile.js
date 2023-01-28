import React from "react";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../Context/Context";
import { SERVER_URL } from "../../EditableStuff/Config";
import { NavLink } from 'react-router-dom';
import axios from "axios";
import './profile.css';
import Loading from '../Loading';
import Error from '../Error';

const Profile = () => {
    const { user,logged_in } = useContext(Context);

    // const projs = user.projects;
    // const blogs = user.blogs;
    const [load,setLoad] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [projects,setProjects] = useState([]);

    const getBlogsAndProjects = async () => {
        try {
            const blogsdata = await axios.get(`${SERVER_URL}/getprofileblogs/${user.username}`);
            const projectdata =await axios.get(`${SERVER_URL}/getMyProjects/${user.username}`);
            if((blogsdata.status === 200) && (projectdata.status === 200)){
                setBlogs(blogsdata.data.blogs);
                setProjects(projectdata.data);
            }
            else{
                setLoad(-1);
            }
        } catch (err) {
            console.log(err);
        }
        
    }

    useEffect(() => {
        if(logged_in===1){
            getBlogsAndProjects();
            setLoad(1);
        }
        else if(logged_in===-1){
            setLoad(-1);
        }
        
    }, [logged_in]);


    return (
        <>
        {load===0?<Loading />:load===1?
        <div className="profile-container adjust">
            {user ? (
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card mb-4">
                            <div className="card-body text-center">
                                <img src={user.photo} alt="avatar"
                                    className="rounded-circle img-fluid" style={{ "width": "150px" }} />
                                <h5 className="my-3">{user.firstname + " " + user.lastname}</h5>
                                <p className="text-muted mb-1">{user.profession}</p>
                                <p className="text-muted mb-4">{user.description}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    {/* <button type="button" className="btn btn-primary">Edit</button> */}
                                    <button type="button" className="btn btn-outline-primary ms-1">Edit</button>
                                </div>
                            </div>
                        </div>
                        <div className="card mb-4 mb-lg-0">
                            <div className="card-body p-0">
                                <ul className="list-group list-group-flush rounded-3">
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                        <i className="fab fa-github fa-lg" style={{ "color": "#333333" }}></i>
                                        <p className="mb-0">Github</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                        <i className="fas fa-envelope fa-lg" style={{ "color": "#55acee" }}></i>
                                        <p className="mb-0">{user.email}</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                        <i className="fab fa-linkedin-in fa-lg" style={{ "color": "#3b5998" }}></i>
                                        <p className="mb-0">linkedin</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">First Name</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{user.firstname}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Last Name</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{user.lastname}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Username</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{user.username}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Mobile</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">987654321</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Year</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{user.year}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="text-primary font-weight-bold mb-4">
                                            My Blogs
                                        </p>
                                        {(blogs.length!==0) && (
                                            blogs.map((blog)=>{
                                                return(
                                                    <>
                                                        <p>{blog.title}</p>
                                                    </>
                                                )
                                            })
                                        ) }
                                        <NavLink to={"/myblogs"}><p>All Blogs<span className='small'> ❯</span></p></NavLink>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="text-primary font-weight-bold mb-4">
                                            My Projects
                                        </p>
                                        {projects && 
                                        <>
                                            {projects.map((project)=>{
                                                return(
                                                    <>
                                                        <p>{project.title}</p>
                                                    </>
                                                )
                                            })}
                                        </>}
                                        <NavLink to={"/myprojects"}><p>All projects<span className='small'> ❯</span></p></NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>) : null}
        </div>
        :<Error />}
        </>
    )
}

export default Profile;