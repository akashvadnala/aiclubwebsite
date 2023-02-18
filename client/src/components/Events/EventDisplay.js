import React, { useRef, useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import EmptyList from "../Blogs/search/EmptyList";
import { useNavigate } from "react-router-dom";
import "./EventDisplay.css";
import axios from "axios";
import Loading from "../Loading";
import { SERVER_URL } from "../../EditableStuff/Config";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import JoditEditor from "jodit-react";
import {editorPreviewConfig} from "../Params/editorConfig";

const EventDisplay = () => {
  const params = new useParams();
  const editor = useRef(null);
  const url = params.url;
  const { user } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [event, setEvent] = useState(null);
  const [edit, setedit] = useState(null);
  const [load, setLoad] = useState(0);
  const navigate = useNavigate();

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

  const getEvent = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/events/getEvent/${url}`);
      if (res.status === 200) {
        setEvent(res.data);
        setLoad(1);
        if (user.isadmin) {
          setedit(true);
        } else {
          setedit(false);
        }
      } else {
        setLoad(-1);
        setedit(false);
        console.log("No Blog Found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEvent();
  }, [user]);

  const deleteEvent = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      `Are you sure to delete the event "${event.title}"?`
    );
    if (confirmed) {
      const res = await axios.delete(
        `${SERVER_URL}/events/deleteEvent/${event.url}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        showAlert("Deletion successful", "success");
        navigate("/events");
      } else {
        showAlert("Failed to delete the event, try again", "danger");
      }
    }
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container projectdisplay-container py-5">
          <Helmet>
            <title>Events - AI Club</title>
          </Helmet>
          <div className="header align-center">
            <h3 className="text-center pb-4">{event.title}</h3>
            {edit && (
              <div className="text-center fs-6 pb-3">
                <NavLink
                  to={`/events/${event.url}/edit`}
                  className="btn btn-primary btn-sm mx-2"
                >
                  Edit{" "}
                </NavLink>
                <NavLink
                  rel="noreferrer"
                  onClick={deleteEvent}
                  className="btn btn-danger btn-sm mx-2"
                >
                  {" "}
                  Delete
                </NavLink>
              </div>
            )}
            <div className="row">
              <div className="col-lg-5 ">
                <img
                  src={event.poster}
                  className="img-fluid rounded"
                  alt="..."
                  style={{ width: "30rem", objectFit: "contain" }}
                />
              </div>
              <div className="col-lg-7">
                <div className="row">
                  <h3 className="text-center pt-4 pt-lg-1 pb-1">Abstract</h3>
                  <p dangerouslySetInnerHTML={{ __html: event.abstract }}></p>
                  <JoditEditor
                    name="content"
                    ref={editor}
                    value={event ? event.abstract : ""}
                    config={editorPreviewConfig}
                  />
                </div>
                <div className="row">
                  <h4 className="text-center pb-1">Event Details</h4>
                  {event.speakers.length>0 && <p className="mb-1">Speaker - {event.speakers.join(", ")}</p>}

                  <p className="mb-1">
                    Start - {convertTime2String(event.eventStart)}
                  </p>
                  <p className="mb-1">
                    End &nbsp;- {convertTime2String(event.eventEnd)}
                  </p>


                  {event.eventLink !== "" &&
                    <>
                      <a href={event.eventLink}>
                        <button type="button" className="btn btn-sm btn-success mt-2">
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
                          </svg>{" "}
                          Join meeting
                        </button>
                      </a>
                    </>
                  } {event.eventLocation &&
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
                        {event.eventLocation}
                      </p>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyList />
      )}
    </>
  );
};

export default EventDisplay;
