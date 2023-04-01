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
  const [reset, setReset] = useState(false);
  const [signin, setsignin] = useState(false);
  const [msg, setMsg] = useState();
  const [competeUser, setCompeteUser] = useState(null);

  // const joinCompete = async () => {
  //   try {
  //     if (props.username) {
  //       setJoining(true);
  //       axios
  //         .post(`${SERVER_URL}/joinCompete`, {
  //           url: props.c.url,
  //           username: props.username,
  //         })
  //         .then((res) => {
  //           if (res.status === 200) {
  //             window.location.reload(true);
  //           }
  //         });
  //     } else {
  //       localStorage.setItem("aiclubnitcsignupredirect", location.pathname);
  //       setModalShow2(true);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {}, []);
  // console.log('path', 'overview'== props.path)
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
                        className={`nav-link ${props.path==key && key == 'overview' && "active"}`}
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
              <button className="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#CompeteLoginModal">Submit</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="CompeteLoginModal" tabindex="-1" aria-labelledby="CompeteLoginModalLabel contained-modal-title-vcenter" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-5">
            <h4 className="text-center">Submit Result</h4>
            <form method="POST" encType="multipart/form-data">
              <div className="modal-body">
                {msg ? <div className="alert alert-danger">{msg}</div> : null}
                <div className="login-container">
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
                          className="form-control rounded-pill py-2 px-4"
                          id="password"
                          aria-describedby="password"
                          placeholder="Enter Passcode"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3 text-start">
                      {/* <label for="file-input">
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
                        <label for="file-input" className="form-control rounded-pill py-2 px-4 mb-4 text-muted">Choose File</label>
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
              {/* <div className="modal-footer">
                <button type="reset" id="modalClose" className="btn btn-sm rounded-pill" data-bs-dismiss="modal"
                >Cancel</button>
              </div> */}
            </form>

          </div>
        </div>
      </div>
    </>
  );
};

export default InductionsHeader;
