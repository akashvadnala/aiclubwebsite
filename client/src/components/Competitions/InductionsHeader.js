import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import CompeteLogin from "../Navbar/CompeteLogin";
import "./Competitions.css";

const InductionsHeader = ({ props }) => {
  console.log("props", props);
  const location = useLocation();
  const [isJoined, setIsJoined] = useState(false);

  let keys = {
    "": "Overview",
    data: "Data",
    leaderboard: "Leaderboard",
    rules: "Rules",
  };
  if (props.access) {
    keys = {
      host: "Host",
      "": "Overview",
      data: "Data",
      leaderboard: "Leaderboard",
      rules: "Rules",
    };
  }
  if (isJoined) {
    keys = {
      "": "Overview",
      data: "Data",
      leaderboard: "Leaderboard",
      rules: "Rules",
      submissions: "Submissions",
    };
  }
  if (props.access && isJoined) {
    keys = {
      host: "Host",
      "": "Overview",
      data: "Data",
      leaderboard: "Leaderboard",
      rules: "Rules",
      submissions: "Submissions",
    };
  }
  const [modalShow2, setModalShow2] = useState(false);
  const [joining, setJoining] = useState(false);
  const joinCompete = async () => {
    try {
      if (props.username) {
        setJoining(true);
        axios
          .post(`${SERVER_URL}/joinCompete`, {
            url: props.c.url,
            username: props.username,
          })
          .then((res) => {
            if (res.status === 200) {
              window.location.reload(true);
            }
          });
      } else {
        localStorage.setItem("aiclubnitcsignupredirect", location.pathname);
        setModalShow2(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setIsJoined(props.isJoined);
  }, [props]);
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

        <div className="card-body p-1">
          <div className="row">
            <div className="col-lg-8 px-5">
              <nav className="inductions-navbar align-items-center">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  {Object.entries(keys).map(([key, value]) => {
                    return (
                      <NavLink
                        type="button"
                        role="tab"
                        className="nav-link"
                        to={`/competitions/${props.c.url}/${key}`}
                        aria-current="page"
                      >
                        {value}
                      </NavLink>
                    );
                  })}
                </div>
              </nav>
            </div>
            <div className="col-lg-4 px-5 py-3 text-end">
              {isJoined ? (
                <button className="btn btn-sm btn-success">
                  <i className="fas fa-check-circle green"></i> Joined
                </button>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
      <CompeteLogin
        compete={props.c.url}
        show={modalShow2}
        onHide={() => setModalShow2(false)}
      />
    </>
  );
};

export default InductionsHeader;
