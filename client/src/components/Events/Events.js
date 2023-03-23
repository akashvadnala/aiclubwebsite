import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import EventSpace from "./EventSpace";
import Loading from "../Loading";
import Error from "../Error";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../Context/Context";
import { Helmet } from "react-helmet";

const Events = () => {
  let page = 1;
  const navigate = useNavigate();
  const params = useParams();
  if (params.page) {
    page = parseInt(params.page);
  }
  const { user } = useContext(Context);
  const [ongoingEvents, setongoingEvents] = useState([]);
  const [pastEvents, setpastEvents] = useState([]);
  const [upcomingEvents, setupcomingEvents] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [load, setLoad] = useState(0);

  const getEventData = async () => {
    try {
      axios.get(`${SERVER_URL}/events/getEvents/${page}`).then((data) => {
        setongoingEvents(data.data.ongoing);
        setpastEvents(data.data.past);
        setupcomingEvents(data.data.upcoming);
        setNumPages(data.data.numPages);
        if (page != data.data.page) {
          navigate(`/events/page/${data.data.page}`)
        }
        setLoad(1);
      });
    } catch (err) {
      setLoad(-1);
      console.log(err);
    }
  };

  useEffect(() => {
    setLoad(0);
    getEventData();
  }, [page]);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="event-container container pb-4">
          <Helmet>
            <title>Events - AI Club</title>
          </Helmet>
          <div className="row align-items-center py-4">
            <div className="col-md-4 text-header text-center text-md-start">
              Events
            </div>
            <div className="col-md-8 text-center text-md-end">
              {user && user.isadmin ? (
                <NavLink
                  rel="noreferrer"
                  to="/addevent"
                  className="btn btn-sm btn-success"
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
                  Add Event
                </NavLink>
              ) : null}
            </div>
          </div>
          <div>
            {ongoingEvents.length ? (
              <div className="row">
                <h4>Ongoing Events</h4>
                {ongoingEvents.map((event, i) => {
                  return (
                    <div className="col-12 pb-3 px-3" key={i}>
                      <EventSpace event={event} />
                    </div>
                  );
                })}
              </div>
            ) : null}
            {upcomingEvents.length ? (
              <div className="row">
                <h4>UpComing Events</h4>
                {upcomingEvents.map((event, i) => {
                  return (
                    <div className="col-12 pb-3 px-3" key={i}>
                      <EventSpace event={event} />
                    </div>
                  );
                })}
              </div>
            ) : null}
            {pastEvents.length ? (
              <div className="row">
                <h4>Past Events</h4>
                {pastEvents.map((event, i) => {
                  return (
                    <div className="col-12 pb-3 px-3" key={i}>
                      <EventSpace event={event} />
                    </div>
                  );
                })}
              </div>
            ) : null}
            <div className="pb-3 align-items-center">
              <nav aria-label="...">
                <ul className="pagination justify-content-center">
                  <li className={`page-item align-items-center ${page === 1 ? "disabled" : ""}`}>
                    <NavLink className="page-link" to={`/events/page/1`}>

                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 8 16" focusable="false" aria-hidden="true" fill={`${page === 1 ? "#6f7373" : "#0d6efd"}`}>
                        <path d="M5.874.35a1.28 1.28 0 011.761 0 1.165 1.165 0 010 1.695L3.522 6l4.113 3.955a1.165 1.165 0 010 1.694 1.28 1.28 0 01-1.76 0L0 6 5.874.35z"></path>
                      </svg>
                      &nbsp;Previous
                    </NavLink>
                  </li>
                  {
                    page > 3 &&
                    <li className={`page-item ${1 === page ? "active" : ""}`}>
                      <NavLink className="page-link" to={`/events/page/1`}>1</NavLink>
                    </li>
                  }
                  {page > 4 &&
                    <li className="page-item disabled">
                      <NavLink className="page-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" viewBox="0 0 10 2" focusable="false" aria-hidden="true"><path d="M9 2c-.608 0-1-.425-1-1s.392-1 1-1 1 .448 1 1c0 .575-.392 1-1 1zM5 2c-.608 0-1-.425-1-1s.392-1 1-1 1 .448 1 1c0 .575-.392 1-1 1zM1 2c-.608 0-1-.425-1-1s.392-1 1-1 1 .448 1 1c0 .575-.392 1-1 1z"></path>...</svg>
                      </NavLink>
                    </li>
                  }
                  {
                    Array.from({ length: 5 }, (_, index) => {
                      let val = page + index - 2;
                      if (val > 0 && val <= numPages) {
                        return (
                          <li className={`page-item ${val === page ? "active" : ""}`}>
                            <NavLink className="page-link" to={`/events/page/${val}`}>{val}</NavLink>
                          </li>
                        )
                      }
                    })
                  }
                  {page < numPages - 3 &&
                    <li className="page-item disabled">
                      <NavLink className="page-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" viewBox="0 0 10 2" focusable="false" aria-hidden="true"><path d="M9 2c-.608 0-1-.425-1-1s.392-1 1-1 1 .448 1 1c0 .575-.392 1-1 1zM5 2c-.608 0-1-.425-1-1s.392-1 1-1 1 .448 1 1c0 .575-.392 1-1 1zM1 2c-.608 0-1-.425-1-1s.392-1 1-1 1 .448 1 1c0 .575-.392 1-1 1z"></path>...</svg>
                      </NavLink>
                    </li>
                  }
                  {page < numPages - 2 &&
                    <li className={`page-item ${numPages === page ? "active" : ""}`}>
                      <NavLink className="page-link" to={`/events/page/${numPages}`}>{numPages}</NavLink>
                    </li>
                  }
                  <li className={`page-item ${page === numPages ? "disabled" : ""}`}>
                    <NavLink className="page-link" to={`/events/page/${page + 1}`}>
                      Next&nbsp;
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 8 16" focusable="false" aria-hidden="true" fill={`${page === numPages ? "#6f7373" : "#0d6efd"}`}>
                        <path d="M2.126.35a1.28 1.28 0 00-1.761 0 1.165 1.165 0 000 1.695L4.478 6 .365 9.955a1.165 1.165 0 000 1.694 1.28 1.28 0 001.76 0L8 6 2.126.35z"></path>
                      </svg>
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )
      }
    </>
  );
};

export default Events;
