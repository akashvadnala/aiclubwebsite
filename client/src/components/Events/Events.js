import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import EventSpace from "./EventSpace";
import Loading from "../Loading";
import Error from "../Error";
import { NavLink } from "react-router-dom";
import { Context } from "../../Context/Context";
import { Helmet } from "react-helmet";

const Events = () => {
  const { user } = useContext(Context);
  const [ongoingEvents, setongoingEvents] = useState([]);
  const [pastEvents, setpastEvents] = useState([]);
  const [upcomingEvents, setupcomingEvents] = useState([]);
  const [load, setLoad] = useState(0);

  const getEventData = async () => {
    try {
      axios.get(`${SERVER_URL}/events/getEvents`).then((data) => {
        if (data.status === 200) {
          console.log("data", data.data);
          setongoingEvents(data.data.ongoing);
          setpastEvents(data.data.past);
          setupcomingEvents(data.data.upcoming);
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
    getEventData();
  }, []);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="event-container container">
          <Helmet>
            <title>Events - AI Club</title>
          </Helmet>
          <div className="row py-4">
            <div className="col-md-4 text-center text-md-start">
              <h2>Events</h2>
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
            ):null}
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
            ):null}
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
            ):null}
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default Events;
