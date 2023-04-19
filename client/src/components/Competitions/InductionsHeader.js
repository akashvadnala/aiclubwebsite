import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { alertContext } from "../../Context/Alert";
import { SERVER_URL } from "../../EditableStuff/Config";
import CompeteLogin from "../Navbar/CompeteLogin";
import "./Competitions.css";

const InductionsHeader = ({ props }) => {
  const { showAlert } = useContext(alertContext);
  let keys;
  if (props.access) {
    keys = {
      overview: "Overview",
      leaderboard: "Leaderboard",
      host: "Host",
    };
  } else {
    keys = {
      overview: "Overview",
      leaderboard: "Leaderboard",
    };
  }

  const [username, setUsername] = useState(localStorage.getItem("CompeteUsername"));
  const [password, setPassword] = useState(localStorage.getItem("CompetePassword"));
  const [competeFile, setCompeteFile] = useState(null);
  const [signin, setsignin] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [signInOrSignUp, setSignInOrSignUp] = useState(true);  //true->sign,false->signup for join competition modal
  const [competeUser, setCompeteUser] = useState();
  const [competeUserForSignup, setCompeteUserForSignup] = useState({
    // competition: props.c._id,
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [participantCount, setParticipantCount] = useState();
  const [isUserJoined, setIsUserJoined] = useState(false);


  const getCompeteUserData = async () => {
    try{
      await axios.get(`${SERVER_URL}/getCompeteUserData`, { withCredentials: true })
      .then(async data => {
        setCompeteUser(data.data);
        if (data.data._id) {
          await axios.get(`${SERVER_URL}/isJoined/${props.c._id}/${data.data._id}`, { withCredentials: true })
            .then(res => {
              setIsUserJoined(res.data);
            });
        }
      })
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    getCompeteUserData();
    setParticipantCount(props.c.participantCount);
  }, [props.c])

  const Login = async (e) => {
    e.preventDefault();
    setMsg("");
    setsignin(true);
    await axios
      .post(
        `${SERVER_URL}/competeLogin`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      ).then(async (data) => {
        // window.location.reload(true);
        // document.getElementById("modalClose").click();
        setCompeteUser(data.data);
        await axios.get(`${SERVER_URL}/isJoined/${props.c._id}/${data.data._id}`, { withCredentials: true })
          .then(res => {
            setIsUserJoined(res.data);
            if (res.data) {
              showAlert("Already Joined Competition!", "success");
              document.getElementById("modalClose").click();
            }
            else {
              showAlert("Logged in Successfully!", "success");
            }
          });

      }).catch((err) => {
        console.log(err);
        setMsg(err.response.data.error);
        setsignin(false);
      });
  };

  const joinCompete = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${SERVER_URL}/competeUseradd`, competeUserForSignup,
        { withCredentials: true })
        .then(async (res) => {
          setCompeteUser(res.data);
          await axios.get(`${SERVER_URL}/isJoined/${props.c._id}/${res.data._id}`, { withCredentials: true })
            .then(res => {
              setIsUserJoined(res.data);
              if (res.data) {
                showAlert("Already Joined Competition", "success");
                document.getElementById("modalClose").click();
              }
              else {
                showAlert("Logged in Successfully!", "success");
              }
            });
        });
    } catch (err) {
      showAlert(err.response.data.error, "danger");
      console.log(err);
    }
  };

  const joinCompeteAsUser = async () => {
    // console.log('props',props.c._id)
    await axios.put(`${SERVER_URL}/joinCompeteAsUser/${props.c._id}/${competeUser._id}`,{withCredentials:true});
    setIsUserJoined(true);
    setParticipantCount(participantCount + 1);
    showAlert("Joined Competition Successfully!", "success");
    document.getElementById("modalClose").click();
  }

  const submitCompete = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const data = new FormData();
    data.append("competeFile", competeFile, `${Date.now()}-${competeUser.username}-${competeFile.name}`);
    data.append("compete", props.c._id);
    data.append("team", competeUser._id);
    console.log('data', competeFile);
    try {
      await axios.post(`${SERVER_URL}/submitCompeteFile`, data,{withCredentials:true})
        .then(res => {
          document.getElementById("submitModalClose").click();
          setCompeteFile("");
          showAlert('File submitted successfully. Evaluation may take sometime..', "success");
        })
    } catch (err) {
      showAlert("Something went wrong!", "danger");
      console.log(err);
    }
    setSubmitLoading(false);
  }

  return (
    <>
      <div className="card">
        <div className="competition-header">
          <img
            src={props.c.headerPhoto}
            alt="..."
            className="card-img-top"
            style={{ width: "100%", height: "200px" }}
          />
          <div className="header-text">
            <h3>{props.c.title}</h3>
            <p>{props.c.subtitle}</p>
            <p>{participantCount} Teams</p>
          </div>
        </div>

        <div className="card-body px-3 py-2">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav className="inductions-navbar">
                <div className="nav nav-pills" id="nav-tab" role="tablist">
                  {Object.entries(keys).map(([key, value]) => {
                    return (
                      <NavLink
                        type="button"
                        role="tab"
                        className={`nav-link ${props.path === key && key === 'overview' && "active"}`}
                        to={`/competitions/${props.c.url}/${key}`}
                        aria-current="page"
                        key={key}
                      >
                        {value}
                      </NavLink>
                    );
                  })}
                </div>
              </nav>
            </div>
            <div className="col-lg-4 text-end">
              <div className="d-flex  justify-content-end">
                {
                  isUserJoined ?
                    <>
                      <button className="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#FilesSubmitModal">Submit</button>
                      <div className="dropdown show ml-2">
                        <button className="btn btn-sm dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-current="page">
                          Hello {competeUser.name}
                        </button>

                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                          <NavLink className="dropdown-item" to={`/competitions/${props.c.url}/mysubmissions`} aria-current="page">My Submissions</NavLink><hr />
                          <NavLink className="dropdown-item" to="/sffcsdd" aria-current="page">Another action</NavLink><hr />
                          <NavLink className="dropdown-item" to="/safdcx" aria-current="page">Something else here</NavLink>
                        </div>
                      </div>
                    </>
                    :
                    <button className="btn btn-sm btn-outline-dark ml-2" data-bs-toggle="modal" data-bs-target="#RegisterModal">Join Competition</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="FilesSubmitModal" tabIndex="-1" aria-labelledby="FilesSubmitModalLabel contained-modal-title-vcenter" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-5">
            <h4 className="text-center">Submit Result</h4>
            <div className="modal-body">
              {msg ? <div className="alert alert-danger">{msg}</div> : null}
              <div className="login-container">
                <form method="POST" onSubmit={submitCompete} encType="multipart/form-data">
                  <div className="form-group mb-3 text-start">
                    <div>
                      <input type='file'
                        // accept="image/*"
                        name="competeFile"
                        onChange={(e) => setCompeteFile(e.target.files[0])}
                        onClick = {(e)=>{e.target.value = null}}
                        className="form-control rounded-pill py-2 px-4"
                        id='competeFile'
                        aria-describedby='competeFile'
                        required
                        hidden />
                      <label htmlFor="competeFile" className={`form-control rounded-pill py-2 px-4 mb-4 ${!competeFile ? "text-muted" : "text-dark"}`}>{competeFile ? competeFile.name : <>Choose File</>}</label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 px-4"
                    disabled={submitLoading}
                  >
                    {submitLoading ? <>Submitting <i className="fa fa-spinner fa-spin"></i></> : <>Submit</>}
                  </button>
                </form>
                <button type="reset" id="submitModalClose" className="btn btn-sm" data-bs-dismiss="modal" hidden>Close</button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="modal fade" id="RegisterModal" tabIndex="-1" aria-labelledby="RegisterModalLabel contained-modal-title-vcenter" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-5">
            <h4 className="text-center">Join Competition</h4>
            <div className="modal-body">
              {msg ? <div className="alert alert-danger">{msg}</div> : null}
              <div className="login-container text-center">
                {
                  competeUser ?
                    <div className="text-center">
                      <h6 className="mb-4">Join as "{competeUser.username}"</h6>
                      <button type="button" className="btn btn-success" onClick={joinCompeteAsUser}>Join</button>
                    </div>
                    :
                    signInOrSignUp ?
                      <>
                        <form method="POST">
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-control py-2 px-4 rounded-pill"
                                id="username"
                                aria-describedby="username"
                                placeholder="Enter Username or EMail ID"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control rounded-pill py-2 px-4 mb-4"
                                id="password"
                                aria-describedby="password"
                                placeholder="Enter Password"
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary w-100 mb-4 py-2 px-4"
                            onClick={Login}
                            disabled={signin}
                          >
                            {signin ? <>Signing in <i className="fa fa-spinner fa-spin"></i></> : <>Sign in</>}
                          </button>
                        </form>
                        Not Yet Register?<button className="btn btn-sm text-primary" onClick={() => setSignInOrSignUp(false)}>Register Now</button>
                      </>
                      :
                      <>
                        <form method="POST" encType="multipart/form-data">
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="text"
                                name="name"
                                value={competeUserForSignup.name}
                                onChange={(e) => setCompeteUserForSignup({ ...competeUserForSignup, "name": e.target.value })}
                                className="form-control py-2 px-4 rounded-pill"
                                id="name"
                                aria-describedby="name"
                                placeholder="Enter Full Name"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="text"
                                name="username"
                                value={competeUserForSignup.username}
                                onChange={(e) => setCompeteUserForSignup({ ...competeUserForSignup, "username": e.target.value })}
                                className="form-control py-2 px-4 rounded-pill"
                                id="username2"
                                aria-describedby="username"
                                placeholder="Enter Username"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="text"
                                name="phone"
                                value={competeUserForSignup.phone}
                                onChange={(e) => setCompeteUserForSignup({ ...competeUserForSignup, "phone": e.target.value })}
                                className="form-control py-2 px-4 rounded-pill"
                                id="phone"
                                aria-describedby="phone"
                                placeholder="Enter Phone Number"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="text"
                                name="email"
                                value={competeUserForSignup.email}
                                onChange={(e) => setCompeteUserForSignup({ ...competeUserForSignup, "email": e.target.value })}
                                className="form-control py-2 px-4 rounded-pill"
                                id="email"
                                aria-describedby="username"
                                placeholder="Enter EMail ID"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="password"
                                name="password"
                                value={competeUserForSignup.password}
                                onChange={(e) => setCompeteUserForSignup({ ...competeUserForSignup, "password": e.target.value })}
                                className="form-control rounded-pill py-2 px-4"
                                id="password2"
                                aria-describedby="password"
                                placeholder="Enter Passcode"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group mb-3 text-start">
                            <div>
                              <input
                                type="password"
                                name="cpassword"
                                value={competeUserForSignup.cpassword}
                                onChange={(e) => setCompeteUserForSignup({ ...competeUserForSignup, "cpassword": e.target.value })}
                                className="form-control rounded-pill py-2 px-4"
                                id="cpassword"
                                aria-describedby="cpassword"
                                placeholder="Confirm Passcode"
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary w-100 mb-4 py-2 px-4"
                            disabled={signin}
                            onClick={joinCompete}
                          >
                            {signin ? <>Submitting<i className="fa fa-spinner fa-spin"></i></> : <>Submit</>}
                          </button>
                        </form>
                        Already Registered?<button className="btn btn-sm text-primary" onClick={() => setSignInOrSignUp(true)}>Login</button>
                      </>
                }
                <button type="reset" id="modalClose" className="btn btn-sm" data-bs-dismiss="modal" hidden>Close</button>
              </div>
            </div >
          </div >
        </div >
      </div >
    </>
  );
};

export default InductionsHeader;
