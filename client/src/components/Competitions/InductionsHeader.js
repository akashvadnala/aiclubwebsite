import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import CompeteLogin from "../Navbar/CompeteLogin";
import "./Competitions.css";

const InductionsHeader = ({ props }) => {
  const location = useLocation();
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
  useEffect(() => {}, []);
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
          <div className="row align-items-center">
            <div className="col-lg-10 px-4">
              <nav className="inductions-navbar">
                <div className="nav nav-pills" id="nav-tab" role="tablist">
                  {Object.entries(keys).map(([key, value]) => {
                    return (
                      <NavLink
                        type="button"
                        role="tab"
                        className={`nav-link ${key === props.path && "active"}`}
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
            <div className="col-lg-2 py-1">
              {
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
              }
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
