import React from "react";
import "./EventSpace.css";
import { NavLink } from "react-router-dom";

const EventSpace = (props) => {
  const convertTime2String = (date) => {
    const d = new Date(date);
    var session;
    const starteventdate = d.toDateString();
    var starteventtimehours = d.getHours();
    if (starteventtimehours > 12) {
      session = " PM";
      starteventtimehours -= 12;
    } else {
      session = " AM";
    }
    var starteventtimemin = d.getMinutes();
    if (starteventtimemin < 10) {
      starteventtimemin = "0" + String(starteventtimemin);
    }
    return (
      starteventdate +
      " " +
      String(starteventtimehours) +
      ":" +
      starteventtimemin +
      session
    );
  };
  return (
    <div className="eventSpace col-xs-12">
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-2">
            <img
              src={props.event.poster}
              className="rounded-circle mx-3 my-3"
              alt="..."
              style={{ 'width': "6.5rem", 'height': "6.5rem" }}
            />
          </div>

          <div className="col-md-4 align-self-center">
            <div className="card-body">
              <h5 className="card-title">
                <strong>{props.event.title}</strong>
              </h5>
              {props.event.speakers.length!==0 &&
                <>
                  <p className="card-text">
                    by <strong>{props.event.speakers.join(", ")}</strong>
                  </p>
                </>
              }

            </div>
          </div>

          <div className="col-md-4 align-self-center">
            <div className="card-body">
              <p className="card-text mb-1">
                Start - {convertTime2String(props.event.eventStart)}
              </p>
              <p className="card-text mb-1">
                End &nbsp;- {convertTime2String(props.event.eventEnd)}
              </p>
              {props.event.eventLink !== "" &&
                <>
                  <p
                    className="card-text mb-1"
                    id="link"
                    type="button"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Tooltip on top"
                    onClick={() => (window.location = `${props.event.eventLink}`)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-link-45deg"
                      viewBox="0 0 16 18"
                    >
                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                    </svg>
                    Event Link
                  </p>
                </>}
              {props.event.eventLocation !== "" &&
                <>
                  <p className="card-text">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-geo-alt"
                      viewBox="0 0 16 18"
                    >
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>
                    {props.event.eventLocation}
                  </p>
                </>
              }
            </div>
          </div>
          <div className="col-md-2 align-self-center">
            <NavLink
              rel="noreferrer"
              to={`/events/${props.event.url}`}
              className="btn btn-outline-secondary btn-sm m-1"
            >
              VIEW MORE{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-right-circle-fill"
                viewBox="0 0 16 18"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSpace;
