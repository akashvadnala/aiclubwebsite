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

const Competitions = () => {
  const { user } = useContext(Context);
  const [competitions, setCompetitions] = useState([]);
  const [load, setLoad] = useState(0);

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

  // const getCompeteUserData = async () => {
  //   await axios.get(`${SERVER_URL}/getCompeteUserData`)
  //     .then((data) => {
  //       setCompeteUser(data.data);
  //     })
  //     .catch((err) => {
  //       console.log('No compete User..')
  //     })
  // }

  // useEffect(() => {
  //   getCompeteUserData();
  // }, []);

  // const Login = async (e) => {
  //   e.preventDefault();
  //   setMsg("");
  //   setsignin(true);
  //   await axios
  //     .post(
  //       `${SERVER_URL}/competeLogin`,
  //       {
  //         username: username,
  //         password: password,
  //       },
  //       { withCredentials: true }
  //     ).then((res) => {
  //       window.location.reload(true);
  //     }).catch((err) => {
  //       console.log(err);
  //       setMsg(err.response.data.error);
  //       setsignin(false);
  //     });
  // };

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
              <div className="col-md-8 text-center text-md-end">
                {/* {competeUser ?
                  <>
                    Logged in as {competeUser.username}
                  </>
                  :
                  <button
                    rel="noreferrer"
                    data-bs-toggle="modal" data-bs-target="#CompeteLoginModal"
                    className="btn btn-sm hover-underline text-primary rounded-pill"
                  >
                    Login/Register Here for Competitions
                  </button>
                } */}
                {/* <span class="d-inline-block" tabindex="0" data-toggle="tooltip" title="Disabled tooltip">
                  <button class="btn btn-primary" style={{pointerEvents: "none"}} type="button" disabled>Disabled button</button>
                </span> */}
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
    </>
  );
};

export default Competitions;
