import React, { useState, useContext, useEffect } from "react";
import "../Blogs/Blogs.css";
import { Context } from "../../Context/Context";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";
import { Helmet } from "react-helmet";
import Loading from "../Loading";
import Error from "../Error";
import CompetitionSpace from "./CompetitionSpace";
import { alertContext } from "../../Context/Alert";

const Competitions = () => {
  const { user } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [competitions, setCompetitions] = useState([]);
  const [load, setLoad] = useState(0);
  const [competeUser, setCompeteUser] = useState();
  const [signin, setsignin] = useState(false);
  const [signInOrSignUp, setSignInOrSignUp] = useState(true);  //true->sign,false->signup for join competition modal
  const [msg, setMsg] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [competeUserForSignup, setCompeteUserForSignup] = useState({
    // competition: props.c._id,
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const getCompetitionsData = async () => {
    try {
      await axios.get(`${SERVER_URL}/getCompeteNames`).then((data) => {
        if (data.status === 201) {
          setCompetitions(data.data);
          setLoad(1);
        } else {
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCompetitionsData();
  }, [user]);

  const getCompeteUserData = async () => {
    await axios.get(`${SERVER_URL}/getCompeteUserData`, { withCredentials: true })
      .then(data => {
        setCompeteUser(data.data);
      })
  }

  useEffect(() => {
    getCompeteUserData();
  }, [])

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
      ).then((res) => {
        // window.location.reload(true);
        document.getElementById("modalClose").click();
        setCompeteUser(res.data);
        showAlert("Logged in Successfully!", "success");
      }).catch((err) => {
        console.log(err);
        setMsg(err.response.data.error);
        setsignin(false);
      });
  };

  const Logout = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/competeLogout`, {
        withCredentials: true,
      });
      setCompeteUser(null);
    } catch (err) {
      console.log("Unable to logout..");
    }
    // window.location.reload(true);
  };


  const joinCompete = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${SERVER_URL}/competeUseradd`, competeUserForSignup,
        { withCredentials: true })
        .then((res) => {
          showAlert("Logged in Successfully!", "success");
          setCompeteUser(res.data);
        });
      document.getElementById("modalClose").click();
    } catch (err) {
      showAlert(err.response.data.error, "danger");
      console.log(err);
    }
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="blog-container container">
          <Helmet>
            <title>Competitions - AI Club</title>
          </Helmet>
          <>
            <div className="row align-items-center py-4">
              <div className="col-md-4 text-center text-md-start text-header">
                Competitions
              </div>
              <div className="col-md-8 d-flex justify-content-center justify-content-md-end">
                {competeUser ?
                  <>
                    <div className="dropdown show">
                      <button className="btn btn-sm dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-current="page">
                        Hello {competeUser.name}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <button className="dropdown-item" onClick={Logout} aria-current="page">Logout</button><hr />
                        <NavLink className="dropdown-item" to="/sffcsdd" aria-current="page">Another action</NavLink><hr />
                        <NavLink className="dropdown-item" to="/safdcx" aria-current="page">Something else here</NavLink>
                      </div>
                    </div>
                  </>
                  :
                  <button
                    rel="noreferrer"
                    data-bs-toggle="modal" data-bs-target="#CompeteLoginModal"
                    className="btn btn-sm rounded-pill"
                  >
                    Login/Register
                  </button>
                }
                {user && user.competitionsAccess.length ? (
                  <NavLink
                    rel="noreferrer"
                    to="/draftcompetitions"
                    className="btn btn-sm btn-primary ml-2"
                  >
                    Draft
                  </NavLink>
                ) : null}
                {user && user.isadmin ? (
                  <NavLink
                    type="button"
                    className="btn btn-sm btn-success ml-2"
                    to="/create-competition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-plus-circle-fill"
                      viewBox="0 0 16 18"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>{" "}
                    Create
                  </NavLink>
                ) : null}
              </div>
            </div>
            <div className="row">
              {competitions.map((competition, key) => {
                return (
                  <div className="col-12 col-sm-6 col-lg-3 pb-5 px-3" key={key}>
                    <CompetitionSpace competition={competition} />
                  </div>
                );
              })}
            </div>
          </>
        </div>
      ) : (
        <Error />
      )}
      <div className="modal fade" id="CompeteLoginModal" tabIndex="-1" aria-labelledby="CompeteLoginModalLabel contained-modal-title-vcenter" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-5">
            <h4 className="text-center">Join Competition</h4>
            <div className="modal-body">
              {msg ? <div className="alert alert-danger">{msg}</div> : null}
              <div className="login-container text-center">

                {
                  signInOrSignUp ?
                    <>
                      <form method="POST">
                        <div className="form-group mb-3 text-start">
                          {/* <label for="username" className="pb-1">
                  Username/Email :
                </label> */}
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
                          {/* <label for="password" className="pb-1">
                  Password :
                </label> */}
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

export default Competitions;
