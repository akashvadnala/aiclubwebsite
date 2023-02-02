import React from "react";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../Context/Context";
import { SERVER_URL } from "../../EditableStuff/Config";
import { NavLink } from 'react-router-dom';
import axios from "axios";
import './profile.css';
import Loading from '../Loading';
import Error from '../Error';
import { alertContext } from "../../Context/Alert";

const Profile = () => {
    const { user, logged_in } = useContext(Context);
    const [team, setTeam] = useState({});
    const [photo, setPhoto] = useState(null);
    const [load, setLoad] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [Img, setImg] = useState();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [change, setChange] = useState(false);
    const [pChange, setPChange] = useState(false);
    const [msg, setMsg] = useState("");
    const { showAlert } = useContext(alertContext);

    const getBlogsAndProjects = async () => {
        if (logged_in === 1) {
            try {
                setTeam(user);
                const blogsdata = await axios.get(`${SERVER_URL}/getprofileblogs/${user._id}`);
                const projectdata = await axios.get(`${SERVER_URL}/getMyProjects/${user._id}`);
                if ((blogsdata.status === 200) && (projectdata.status === 200)) {
                    setBlogs(blogsdata.data.blogs);
                    setProjects(projectdata.data);
                    setLoad(1);
                }
                else {
                    setLoad(-1);
                }
            } catch (err) {
                console.log(err);
            }
        }
        else if (logged_in === -1) {
            setLoad(-1);
        }
    }

    useEffect(() => {
        getBlogsAndProjects();
    }, [logged_in]);

    const forms = [
        {
            'name': 'First Name',
            'link': 'firstname',
            'val': team.firstname,
            'required': true
        },
        {
            'name': 'Last Name',
            'link': 'lastname',
            'val': team.lastname,
            'required': false
        },
        {
            'name': 'Username',
            'link': 'username',
            'val': team.username,
            'required': true
        },
        {
            'name': 'Mobile',
            'link': 'phone',
            'val': team.phone,
            'required': false
        },
        {
            'name': 'Description',
            'link': 'description',
            'val': team.description,
            'required': false
        },
    ]
    const handleInputs = (e) => {
        setTeam({ ...team, [e.target.name]: e.target.value });
    }
    const handlePhoto = (e) => {
        setPhoto(URL.createObjectURL(e.target.files[0]));
        setImg(e.target.files[0]);
        console.log(e.target.files[0]);
    }

    const UpdateTeam = async (e) => {
        e.preventDefault();
        if (!team.firstname || !team.username || !team.position || !team.email) {
            showAlert("Fill required Details!", "danger");
            return;
        }
        if (team.username !== user.username) {
            console.log('Username changed');
            try {
                const res = await axios.get(`${SERVER_URL}/userExist/${team.username}`);
                if (res.status === 200) {
                    console.log('Username Already Exists!');
                    showAlert("Username Already Exists!", "danger");
                    return ;
                }
            } catch (err) {
                console.log(err);
            }
        }
        setPChange(true);
        var imgurl;
        if (Img) {
            const data = new FormData();
            const photoname = Date.now() + Img.name;
            data.append("name", photoname);
            data.append("photo", Img);

            try {
                axios.post(`${SERVER_URL}/imgdelete`,
                    { 'url': team.photo },
                    {
                        headers: { "Content-Type": "application/json" },
                    });
            } catch (err) {
                console.log('photoerr', err);
            }

            try {
                const img = await axios.post(`${SERVER_URL}/imgupload`, data);
                console.log('img', img);
                imgurl = img.data;
                team.photo = imgurl;
            } catch (err) {
                console.log('photoerr', err);
            }
        }
        console.log('imgurl', imgurl);
        try {
            const teamdata = await axios.put(`${SERVER_URL}/teamupdate/${team._id}`,
                team,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            console.log('teamdata', teamdata);
            if (teamdata.status === 200) {
                setEditMode(false);
                setPChange(false);
                showAlert("Profile Updated Successfully!", "success");
            }
            else {
                console.log('Username not found');
            }
        } catch (err) {
            console.log('err', err);
        }
    }

    const changePassword = async (e) => {
        e.preventDefault();
        if (password === "" || newPassword === "" || cPassword === "") {
            setMsg("Fill All Details");
            return;
        }
        setMsg("");
        setChange(true);
        try {
            axios.put(`${SERVER_URL}/changePassword/${user._id}`,
                {
                    password: password,
                    newPassword: newPassword,
                    cPassword: cPassword
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }).then(res => {
                    if (res.status === 200) {
                        document.getElementById("modalClose").click();
                        showAlert(`${res.data.msg}!`, "success");
                        setChange(false);
                    }
                    else {
                        setMsg(res.data.error);
                        setChange(false);
                    }
                })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            {load === 0 ? <Loading /> : load === 1 ?
                <div className="profile-container adjust">
                    {team ? (
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="card mb-4">
                                    <div className="card-body text-center">
                                        <img src={photo ? photo : team.photo} alt="avatar"
                                            className="rounded-circle" style={{ "width": "150px", height: "150px" }} />
                                        {
                                            editMode &&
                                            <>
                                                <label for="photo" style={{ height: "50px" }}>
                                                    <button type="button" className="btn btn-sm btn-outline-primary mt-2">Change Profile Pic</button>
                                                    <input type='file' accept="image/*" name="photo" onChange={handlePhoto} style={{ opacity: 0, zIndex: 10, position: "relative", top: "-40px" }} className="form-control form-control-sm mt-2" id='photo' aria-describedby='photo' />
                                                </label>
                                            </>
                                        }
                                        <h5 className="my-3">{team.firstname + " " + team.lastname}</h5>
                                        {editMode ?
                                            <>
                                                <div className="required d-flex"><input type="text" name="position" value={team.position} onChange={handleInputs} className="form-control form-control-sm mb-1 text-center" id="position" aria-describedby="position" placeholder="Enter Position" required /></div>
                                                <input type="text" name="profession" value={team.profession} onChange={handleInputs} className="form-control form-control-sm mb-3 text-center" id="profession" aria-describedby="profession" placeholder="Enter Profession/Branch" required />
                                            </>
                                            :
                                            <>
                                                <p className="text-muted mb-1">{team.position}</p>
                                                <p className="text-muted mb-3">{team.profession}</p>
                                            </>
                                        }
                                        <div className="d-flex justify-content-center mb-2">
                                            {/* <button type="button" className="btn btn-primary">Edit</button> */}
                                            {
                                                editMode ?
                                                    <>
                                                        <button type="button" onClick={() => {
                                                            setPhoto(null);
                                                            setTeam(user);
                                                            setEditMode(false);
                                                        }} className="btn btn-sm ms-1">Cancel</button>
                                                        {
                                                            pChange?
                                                                <button type="button" className="btn btn-sm btn-outline-success ms-1" disabled>Saving <i class="fa fa-spinner fa-spin"></i></button>
                                                            :
                                                                <button type="button" onClick={UpdateTeam} className="btn btn-sm btn-outline-success ms-1">Save Profile</button>
                                                        }
                                                        
                                                    </>
                                                    :
                                                    <>
                                                        <button type="button" onClick={() => setEditMode(true)} className="btn btn-sm btn-outline-primary ms-1"><i className="fas fa-edit"></i> Edit Profile</button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger ms-1" data-bs-toggle="modal" data-bs-target="#passwordModal" onClick={() => setMsg("")}>Change Password</button>
                                                        <div className="modal fade" id="passwordModal" tabindex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h1 className="modal-title fs-5" id="passwordModalLabel">Change Password</h1>
                                                                    </div>
                                                                    <form method="POST" encType="multipart/form-data">
                                                                        <div className="text-start modal-body">
                                                                            {msg ? <div className="alert alert-danger">{msg}</div> : null}
                                                                            <div className="form-group my-3">
                                                                                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" id="passsword" aria-describedby="password" placeholder="Old Password" required={true} />
                                                                            </div>
                                                                            <div className="form-group my-3">
                                                                                <input type="password" name="newpassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control form-control-lg" id="newpassword" aria-describedby="newpassword" placeholder="New Password" required={true} />
                                                                            </div>
                                                                            <div className="form-group my-3">
                                                                                <input type="password" name="cpassword" value={cPassword} onChange={(e) => setCPassword(e.target.value)} className="form-control form-control-lg" id="password" aria-describedby="cpassword" placeholder="Confirm Password" required={true} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="reset" id="modalClose" className="btn btn-sm btn-secondary" data-bs-dismiss="modal"
                                                                                onClick={() => {
                                                                                    setPassword("");
                                                                                    setNewPassword("");
                                                                                    setCPassword("");
                                                                                    setMsg("");
                                                                                }}
                                                                            >Cancel</button>
                                                                            <button type="submit" onClick={changePassword} className="btn btn-sm btn-primary">
                                                                                {
                                                                                    change ? <span>Updating <i class="fa fa-spinner fa-spin"></i></span> : <span>Update</span>
                                                                                }
                                                                            </button>
                                                                        </div>
                                                                    </form>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-4 mb-lg-0">
                                    <div className="card-body p-0">
                                        <div className="list-group list-group-flush rounded-3">
                                            {
                                                editMode ?
                                                    <>
                                                        <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                            <i className="fab fa-github fa-lg" style={{ "color": "#333333" }}></i>
                                                            <input type="text" name="github" value={team.github} onChange={handleInputs} className="form-control form-control-sm text-end" id="github" aria-describedby="github" placeholder="" />
                                                        </div>
                                                        <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                            <i className="fas fa-envelope fa-lg" style={{ "color": "#55acee" }}></i>
                                                            *<input type="text" name="email" value={team.email} onChange={handleInputs} className="form-control form-control-sm text-end" id="email" aria-describedby="email" placeholder="" required />
                                                        </div>
                                                        <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                            <i className="fab fa-linkedin-in fa-lg" style={{ "color": "#3b5998" }}></i>
                                                            <input type="text" name="linkedin" value={team.linkedin} onChange={handleInputs} className="form-control form-control-sm text-end" id="linkedin" aria-describedby="linkedin" placeholder="" />
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        {team.github && <a href={team.github} rel="noreferrer" target="_blank" className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                            <i className="fab fa-github fa-lg" style={{ "color": "#333333" }}></i>
                                                            <p className="mb-0">Github</p>
                                                        </a>}
                                                        <a href={`tomail:${team.email}`} rel="noreferrer" target="_blank" className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                            <i className="fas fa-envelope fa-lg" style={{ "color": "#55acee" }}></i>
                                                            <p className="mb-0">{team.email}</p>
                                                        </a>
                                                        {team.linkedin && <a href={team.linkedin} rel="noreferrer" target="_blank" className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                            <i className="fab fa-linkedin-in fa-lg" style={{ "color": "#3b5998" }}></i>
                                                            <p className="mb-0">Linkedin</p>
                                                        </a>}
                                                    </>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="card mb-4">
                                    <div className="card-body px-3 py-2">
                                        {
                                            forms.map(form => {
                                                return (
                                                    <>
                                                        <div className="row align-items-center">
                                                            <div className="col-sm-3 py-2">
                                                                <p className="mb-0">{editMode && form.required && <>*</>}{form.name}</p>
                                                            </div>
                                                            {
                                                                editMode ?
                                                                    <div className="col-sm-9 p-0">
                                                                        <input
                                                                            type="text"
                                                                            name={form.link}
                                                                            value={form.val}
                                                                            onChange={handleInputs}
                                                                            className="form-control form-control-sm text-muted"
                                                                            id={form.link}
                                                                            placeholder=""
                                                                            required
                                                                        />
                                                                    </div>
                                                                    :
                                                                    <div className="col-sm-9 p-2">
                                                                        <p className="text-muted mb-0">{form.val}</p>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <hr />
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card mb-4 mb-md-0">
                                            <div className="card-body">
                                                <h6 className="mb-3">
                                                    My Blogs
                                                </h6>
                                                {blogs && (
                                                    blogs.map((blog) => {
                                                        return (
                                                            <>
                                                                <div className="mt-1 blog-link">
                                                                    <NavLink to={`/blogs/${blog.url}`}>{blog.title}</NavLink>
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                )}
                                                <div className="mt-3">
                                                    <NavLink to={"/myblogs"}><p>All Blogs<span className='small'> ❯</span></p></NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card mb-4 mb-md-0">
                                            <div className="card-body">
                                                <h6 className="mb-3">
                                                    My Projects
                                                </h6>
                                                {projects && (
                                                    projects.map((project) => {
                                                        return (
                                                            <>
                                                                <div className="mt-1 blog-link">
                                                                    <NavLink to={`/projects/${project.url}`}>{project.title}</NavLink>
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                )}
                                                <div className="mt-3">
                                                    <NavLink to={"/myprojects"}><p>All Projects<span className='small'> ❯</span></p></NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>) : null}
                </div>
                : <Error />}
        </>
    )
}

export default Profile;