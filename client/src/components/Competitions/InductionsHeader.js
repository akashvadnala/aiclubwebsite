import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import CompeteLogin from "../Navbar/CompeteLogin";
import "./Competitions.css";

const InductionsHeader = ({ props }) => {
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

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [signin, setsignin] = useState(false);
  const [msg, setMsg] = useState();
  const [competeUser, setCompeteUser] = useState({
    competition: props.c._id,
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const joinCompete = async (e) => {
    e.preventDefault()
    try {
      axios
        .post(`${SERVER_URL}/joinCompete`, competeUser)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("CompeteUsername", competeUser.username);
            localStorage.setItem("CompetePassword", competeUser.password);
            window.location.reload(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
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
            <p>{props.c.participantCount} Teams</p>
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
              {/* {
                <NavLink className="btn btn-sm btn-black" onClick={joinCompete}>
                  {joining ? (
                    <>
                      <span>Joining </span>
                      <i className="fa fa-spinner fa-spin"></i>
                    </>
                  ) : (
                    <>Join Competition</>
                  )}
                </NavLink>
              } */}
              <button className="btn btn-sm btn-outline-dark m-1" data-bs-toggle="modal" data-bs-target="#FilesSubmitModal">Submit</button>
              <button className="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#RegisterModal">Join Competition</button>
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
                <form method="POST" encType="multipart/form-data">
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
                        className="form-control rounded-pill py-2 px-4"
                        id="password"
                        aria-describedby="password"
                        placeholder="Enter Passcode"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 text-start">
                    {/* <label htmlFor="file-input">
                        <span className='input_label'>Product Images</span>
                        <div>Choose File</div>
                      </label> */}
                    <div>
                      <input type='file'
                        accept="image/*"
                        name="photo"
                        onChange={(e) => { }}
                        className="form-control rounded-pill py-2 px-4"
                        id='file-input'
                        aria-describedby='photo'
                        required
                        hidden />
                      <label htmlFor="file-input" className="form-control rounded-pill py-2 px-4 mb-4 text-muted">Choose File</label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 px-4"
                    // onClick={Login}
                    disabled={signin}
                  >
                    {signin ? <>Submitting<i className="fa fa-spinner fa-spin"></i></> : <>Submit</>}
                  </button>
                </form>
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
              <div className="login-container">
                <form method="POST" encType="multipart/form-data">
                  <div className="form-group mb-3 text-start">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={competeUser.name}
                        onChange={(e) => setCompeteUser({ ...competeUser, "name": e.target.value })}
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
                        value={competeUser.username}
                        onChange={(e) => setCompeteUser({ ...competeUser, "username": e.target.value })}
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
                        value={competeUser.phone}
                        onChange={(e) => setCompeteUser({ ...competeUser, "phone": e.target.value })}
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
                        value={competeUser.email}
                        onChange={(e) => setCompeteUser({ ...competeUser, "email": e.target.value })}
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
                        value={competeUser.password}
                        onChange={(e) => setCompeteUser({ ...competeUser, "password": e.target.value })}
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
                        value={competeUser.cpassword}
                        onChange={(e) => setCompeteUser({ ...competeUser, "cpassword": e.target.value })}
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
                    className="btn btn-primary w-100 py-2 px-4"
                    disabled={signin}
                    onClick={joinCompete}
                  >
                    {signin ? <>Submitting<i className="fa fa-spinner fa-spin"></i></> : <>Submit</>}
                  </button>
                </form>
              </div>
            </div >
          </div >
        </div >
      </div >
    </>
  );
};

export default InductionsHeader;
