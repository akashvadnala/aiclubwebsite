import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import "./AddEvent.css";
import { Context } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import Error from "../Error";
import { CLIENT_URL, SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import JoditEditor from "jodit-react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const EditEvent = () => {
  const params = new useParams();
  const url = params.url;
  const navigate = useNavigate();
  const editor = useRef(null);
  const { user } = useContext(Context);
  const [add, setAdd] = useState("Save as Draft");
  const [add2, setAdd2] = useState();
  const [xspeakers, setXspeakers] = useState("");
  const [preview, setPreview] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [event, setEvent] = useState({
    title: "",
    url: "",
    speakers: [],
    poster: "",
    abstract: "",
    eventStart: new Date(),
    eventEnd: new Date(),
    eventLink: "",
    eventLocation: "",
  });

  const getEvent = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/events/getEvent/${url}`);
      console.log("blog", res.status);
      if (res.status === 200) {
        console.log("blog", res.data);
        setEvent(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleValue = (e) => {
    setEvent({ ...event, ["abstract"]: e });
  };

  useEffect(() => {
    getEvent();
    if (!user) {
      navigate("/events");
    }
  }, [user]);

  const handleposterPhoto = (e) => {
    setEvent({ ...event, ["poster"]: e.target.files[0] });
  };

  const handleInputs = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
    console.log("post", event);
  };

  const removeXspeakers = (speaker) => {
    let current = event.speakers;
    current = current.filter((x) => x !== speaker);
    setEvent({ ...event, ["speakers"]: current });
    setXspeakers("");
  };

  const AddXspeakers = () => {
    let current = event.speakers;
    current.push(xspeakers);
    setEvent({ ...event, ["tags"]: current });
    setXspeakers("");
  };

  const seteventStartDate = (date) => {
    setStartDate(date);
    setEvent({ ...event, ["eventStart"]: date });
  };

  const seteventEndDate = (date) => {
    setEndDate(date);
    setEvent({ ...event, ["eventEnd"]: date });
  };

  const EditEvent = async (e) => {
    e.preventDefault();
    setAdd("Saving ");
    setAdd2(<i className="fa fa-spinner fa-spin"></i>);
    var imgurl;
    const data = new FormData();
    const photoname = Date.now() + event.poster.name;
    if (typeof event.poster !== 'string'){
      data.append("name", photoname);
      data.append("photo", event.poster);
  
      try {
        const img = await axios.post(`${SERVER_URL}/imgupload`, data);
        imgurl = img.data;
        event.poster = imgurl;
        console.log("final post", event);
      } catch (err) {
        console.log("photoerr", err);
      }
    }
    try {
      const eventdata = await axios.put(
        `${SERVER_URL}/events/updateEvent/${url}`,
        event,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("blogdata", eventdata);
      if (eventdata.status === 422 || !eventdata) {
        window.alert("Posting failed");
        console.log("Posting failed");
      } else {
        setAdd("Save as Draft");
        setAdd2("");
        setPreview(true);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      {user ? (
        <div className="container addBlog-container text-center">
          <div className="adjust">
            <Helmet>
              <title>Events - AI Club</title>
            </Helmet>
            <h3>Edit Event</h3>
            <div className="text-center fs-6 pb-1">
              {preview ? (
                <NavLink
                  to={`/events/${event.url}`}
                  className="btn btn-success btn-sm"
                >
                  Preview
                </NavLink>
              ) : (
                <span className="text-muted">Save for Preview</span>
              )}
            </div>
            <form
              method="POST"
              onSubmit={EditEvent}
              encType="multipart/form-data"
            >
              <div className="form-group my-3 row">
                <label htmlFor="title" className="col-sm-2 text-end">
                  Event Title :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="title"
                    value={event.title}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Enter Blog Title"
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="url" className="col-sm-2 text-end">
                  Event Url :
                </label>
                <div className="col-sm-10">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text text-end"
                        id="basic-addon3"
                      >
                        {CLIENT_URL}/events/{event.url}
                      </span>
                    </div>
                    <input
                      type="text"
                      name="url"
                      value={event.url}
                      onChange={handleInputs}
                      className="form-control"
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Enter Blog Url"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label className="col-sm-2 text-end">Speakers :</label>
                <div className="col-sm-10">
                  {event.speakers.map((a) => {
                    return (
                      <div className="form-group my-2 row">
                        <div className="col col-9">
                          <input
                            type="text"
                            value={a}
                            className="form-control"
                            id="tag"
                            aria-describedby="title"
                            disabled
                          />
                        </div>
                        <div className="col col-3">
                          <input
                            type="reset"
                            className="btn btn-danger"
                            onClick={() => removeXspeakers(a)}
                            value="Remove"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="form-group my-2 row">
                    <div className="col col-9">
                      <input
                        type="text"
                        name="xspeakers"
                        value={xspeakers}
                        onChange={(e) => setXspeakers(e.target.value)}
                        className="form-control"
                        id="xspeakers"
                        aria-describedby="xspeakers"
                        placeholder="Enter speaker's name"
                      />
                    </div>
                    <div className="col col-3">
                      <input
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXspeakers}
                        value="+Add"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Event Poster :
                </label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handleposterPhoto}
                    className="form-control"
                    id="photo"
                    aria-describedby="photo"
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Start Time :
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => seteventStartDate(date)}
                    showTimeSelect
                    minDate={new Date()}
                    filterTime={filterPassedTime}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  End Time :
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => seteventEndDate(date)}
                    showTimeSelect
                    minDate={new Date()}
                    filterTime={filterPassedTime}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Abstract :
                </label>
                <div className="col-sm-10">
                  <JoditEditor
                    name="content"
                    ref={editor}
                    value={event ? event.abstract : ""}
                    onChange={handleValue}
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="title" className="col-sm-2 text-end">
                  Event Link :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="eventLink"
                    value={event.eventLink}
                    onChange={handleInputs}
                    className="form-control"
                    id="eventLink"
                    aria-describedby="eventLink"
                    placeholder="Enter event link if conducted in online"
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="title" className="col-sm-2 text-end">
                  Event Location :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="eventLocation"
                    value={event.eventLocation}
                    onChange={handleInputs}
                    className="form-control"
                    id="eventLocation"
                    aria-describedby="eventLocation"
                    placeholder="Enter event venue if conducted in offline"
                  />
                </div>
              </div>

              <button
                type="submit"
                name="submit"
                id="submit"
                className="btn btn-primary"
              >
                {add}
                {add2}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default EditEvent;
