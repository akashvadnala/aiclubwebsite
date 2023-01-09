import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import EventSpace from "./EventSpace";
import Loading from "../Loading";
import Error from "../Error";
import { NavLink } from "react-router-dom";
import { Context } from "../../Context/Context";

const eventList = [
  {
    title: "A 3 Day All India Workshop on Generative Adversarial Networks",
    eventStart: "2022-12-30T10:12:34.487+00:00",
    eventEnd: "2022-12-30T11:12:34.487+00:00",
    speakers: ["Anirudh", "Bhanu Prakash"],
    cover: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    poster: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    eventLink:"https://meet.google.com/kaw-tjrm-rck",
    eventLocation:"Auditorium NITC",
    abstract:
      "Dr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computing",
  },
  {
    title: "A 3 Day All India Workshop on Generative Adversarial Networks",
    eventStart: "2022-12-30T10:12:34.487+00:00",
    eventEnd: "2022-12-30T11:12:34.487+00:00",
    speakers: ["Anirudh", "Bhanu Prakash"],
    cover: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    poster: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    eventLink:"https://meet.google.com/kaw-tjrm-rck",
    eventLocation:"Auditorium NITC",
    abstract:
      "Dr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computing",
  },
  {
    title: "A 3 Day All India Workshop on Generative Adversarial Networks",
    eventStart: "2022-12-30T10:12:34.487+00:00",
    eventEnd: "2022-12-30T11:12:34.487+00:00",
    speakers: ["Anirudh", "Bhanu Prakash"],
    cover: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    poster: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    eventLink:"https://meet.google.com/kaw-tjrm-rck",
    eventLocation:"Auditorium NITC",
    abstract:
      "Dr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computing",
  },
  {
    title: "A 3 Day All India Workshop on Generative Adversarial Networks",
    eventStart: "2022-12-30T10:12:34.487+00:00",
    eventEnd: "2022-12-30T11:12:34.487+00:00",
    speakers: ["Anirudh", "Bhanu Prakash"],
    cover: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    poster: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    eventLink:"https://meet.google.com/kaw-tjrm-rck",
    eventLocation:"Auditorium NITC",
    abstract:
      "Dr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computing",
  },
  {
    title: "A 3 Day All India Workshop on Generative Adversarial Networks",
    eventStart: "2022-12-30T10:12:34.487+00:00",
    eventEnd: "2022-12-30T11:12:34.487+00:00",
    speakers: ["Anirudh", "Bhanu Prakash"],
    cover: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    poster: "https://preview.colorlib.com/theme/confer/img/bg-img/10.jpg",
    eventLink:"https://meet.google.com/kaw-tjrm-rck",
    eventLocation:"Auditorium NITC",
    abstract:
      "Dr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computingDr. Aditya Bhaskara on How ML has changed computing",
  }
];

const Events = () => {
  const { user } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    setEvents(eventList);
    console.log(events);
  }, []);
  return (
    <div className="event-container container">
      <div className="row py-4">
        <div className="col-4">
          <h2>Events</h2>
        </div>
        <div className="col-8 text-end">
          {user ? (
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
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>{" "}
              Add Event
            </NavLink>
          ) : null}
        </div>
        <div className="row">
          {events.map((event, i) => {
            return (
              <div className="col-12 pb-3 px-3" key={i}>
                <EventSpace event={event} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Events;
