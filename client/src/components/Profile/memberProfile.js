import React from "react";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../Context/Context";
import { SERVER_URL } from "../../EditableStuff/Config";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import './profile.css';
import Loading from '../Loading';
import Error from '../Error';
import { alertContext } from "../../Context/Alert";

const MemberProfile = () => {
    const params = new useParams();
    let username = params.username;
    const [load, setLoad] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [userData, setUserdata] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useContext(alertContext);

    const getData = async () => {
        try {
            const userdata = await axios.get(`${SERVER_URL}/getUserDataForEdit/${username}`);
            setUserdata(userdata.data);
            const blogsdata = await axios.get(`${SERVER_URL}/blogs/getprofileblogs/${userdata.data._id}`);
            setBlogs(blogsdata.data.blogs);
            const projectdata = await axios.get(`${SERVER_URL}/getProfileProjects/${userdata.data._id}`);
            setProjects(projectdata.data);
            setLoad(1);
        } catch (error) {
            console.log(error);
            showAlert(`${error.response.data.error}`, "danger");
            setLoad(-1);
            navigate('/team');
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            {load === 0 ? <Loading /> : load === 1 ?
                <div className="profile-container adjust">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <img src={userData.photo} alt="avatar"
                                        className="rounded-circle" style={{ "width": "150px", height: "150px" }} />
                                    <h5 className="my-3">{userData.firstname + " " + userData.lastname}</h5>
                                    <p className="text-muted mb-1">{userData.position}</p>
                                    <p className="text-muted mb-3">{userData.profession}</p>

                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                    <div className="list-group list-group-flush rounded-3">
                                        {userData.github && <a href={userData.github} rel="noreferrer" target="_blank" className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fab fa-github fa-lg" style={{ "color": "#333333" }}></i>
                                            <p className="mb-0">Github</p>
                                        </a>}
                                        <a href={`tomail:${userData.email}`} rel="noreferrer" target="_blank" className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-envelope fa-lg" style={{ "color": "#55acee" }}></i>
                                            <p className="mb-0">{userData.email}</p>
                                        </a>
                                        {userData.linkedin && <a href={userData.linkedin} rel="noreferrer" target="_blank" className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fab fa-linkedin-in fa-lg" style={{ "color": "#3b5998" }}></i>
                                            <p className="mb-0">Linkedin</p>
                                        </a>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body px-3 py-2">
                                    <div className="row align-items-center">
                                        <div className="col-sm-3 py-2">
                                            <p className="mb-0">First Name</p>
                                        </div>
                                        <div className="col-sm-9 p-2">
                                            <p className="text-muted mb-0">{userData.firstname}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row align-items-center">
                                        <div className="col-sm-3 py-2">
                                            <p className="mb-0">Last Name</p>
                                        </div>
                                        <div className="col-sm-9 p-2">
                                            <p className="text-muted mb-0">{userData.lastname}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row align-items-center">
                                        <div className="col-sm-3 py-2">
                                            <p className="mb-0">Username</p>
                                        </div>
                                        <div className="col-sm-9 p-2">
                                            <p className="text-muted mb-0">{userData.username}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    {userData.phone &&
                                        <>
                                            <div className="row align-items-center">
                                                <div className="col-sm-3 py-2">
                                                    <p className="mb-0">Mobile</p>
                                                </div>
                                                <div className="col-sm-9 p-2">
                                                    <p className="text-muted mb-0">{userData.phone}</p>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    }
                                    <div className="row align-items-center">
                                        <div className="col-sm-3 py-2">
                                            <p className="mb-0">Description</p>
                                        </div>
                                        <div className="col-sm-9 p-2">
                                            <p className="text-muted mb-0">{userData.description}</p>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card mb-4 mb-md-0">
                                        <div className="card-body">
                                            <h6 className="mb-3 text-primary">
                                            Recent Blogs
                                            </h6>
                                            {blogs && (
                                                blogs.map((blog, index) => {
                                                    if(blog.public){
                                                        return (
                                                            <>
                                                                <div key={index} className="mt-1 blog-link">
                                                                    <NavLink to={`/blogs/${blog.url}`}>{blog.title}</NavLink>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    else{
                                                        return(
                                                            <></>
                                                        )
                                                    }
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card mb-4 mb-md-0">
                                        <div className="card-body">
                                            <h6 className="mb-3 text-primary">
                                                Recent Projects
                                            </h6>
                                            {projects && (
                                                projects.map((project, index) => {
                                                    if(project.public){
                                                        return (
                                                            <>
                                                                <div key={index} className="mt-1 blog-link">
                                                                    <NavLink to={`/projects/${project.url}`}>{project.title}</NavLink>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    else{
                                                        return(
                                                            <></>
                                                        )
                                                    }
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <Error />}
        </>
    )
}

export default MemberProfile;