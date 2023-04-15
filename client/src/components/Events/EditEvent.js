import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import "./AddEvent.css";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { useNavigate } from "react-router-dom";
import { CLIENT_URL, SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import JoditEditor from "jodit-react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import Loading from "../Loading";
import Error from "../Error";
import { editorConfig } from "../Params/editorConfig";

const EditEvent = () => {
  const params = new useParams();
  const url = params.url;
  const navigate = useNavigate();
  const editor = useRef(null);
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [add, setAdd] = useState(false);
  const [xspeakers, setXspeakers] = useState("");
  const [preview, setPreview] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [load, setLoad] = useState(0);
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
      if (res.status === 200) {
        setEvent(res.data);
        setLoad(1);
      }
    } catch (err) {
      setLoad(-1);
    }
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleValue = (e) => {
    setEvent({ ...event, abstract: e });
  };

  useEffect(() => {
    if (logged_in === 1) {
      if (url && user && user.isadmin) {
        getEvent();
      } else {
        setLoad(-1);
      }
    } else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in, url]);

  const handleposterPhoto = (e) => {
    setEvent({ ...event, poster: e.target.files[0] });
  };

  const handleInputs = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleUrl = (e) => {
    let value = e.target.value;
    let url = "";
    for (let i = 0; i < value.length; i++) {
      const c = value[i];
      if (("a" <= c && c <= "z") || ("A" <= c && c <= "Z") || ("0" <= c && c <= "9") || c === "-" || c === '_') {
        url += c;
      }
      else {
        showAlert("Special Characters are not allowed except '-' and '_'", "danger");
      }
    }
    setEvent({ ...event, url: url });
  }

  const removeXspeakers = (speaker) => {
    let current = event.speakers;
    current = current.filter((x) => x !== speaker);
    setEvent({ ...event, speakers: current });
    setXspeakers("");
  };

  const AddXspeakers = () => {
    let current = event.speakers;
    current.push(xspeakers);
    setEvent({ ...event, tags: current });
    setXspeakers("");
  };

  const seteventStartDate = (date) => {
    setStartDate(date);
    setEvent({ ...event, eventStart: date });
  };
  const seteventEndDate = (date) => {
    setEndDate(date);
    setEvent({ ...event, eventEnd: date });
  };

  const EditEvent = async (e) => {
    e.preventDefault();
    setAdd(true);
    var imgurl;
    const data = new FormData();
    const photoname = Date.now() + event.poster.name;
    if (typeof event.poster !== "string") {
      data.append("name", photoname);
      data.append("photo", event.poster);
      data.append("category","events");

      try {
        axios.delete(
          `${SERVER_URL}/imgdelete`,
          { url: event.poster },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch (err) {

        showAlert(err.response.error, "danger")
      }

      try {
        const img = await axios.post(`${SERVER_URL}/imgupload`, data, {
          withCredentials: true,
        });
        imgurl = img.data;
        event.poster = imgurl;
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
          withCredentials: true
        },
      );
      console.log("blogdata", eventdata);
      if (eventdata.status === 500 || !eventdata) {
        showAlert("Failed to save", "danger");
      } else {
        setAdd(false);
        showAlert("Event Updated!", "success");
        setPreview(true);
      }
    } catch (err) {
      console.log("err", err);
      navigate("/events");
      showAlert(err.response.error, "danger");
    }
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container addBlog-container text-center">
          <Helmet>
            <title>Events - AI Club</title>
          </Helmet>
          <div className="adjust pb-4">
            <div className="text-header pt-4 pb-1">Edit Event</div>
            <div className="text-center fs-6 pb-4">
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
              <div className="form-group align-items-center row">
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
              <div className="form-group align-items-center mt-3 row">
                <label htmlFor="url" className="col-sm-2 text-end">
                  Event Url :
                </label>
                <div className="col-sm-10">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text text-end"
                        id="basic-addon3"
                      >
                        {CLIENT_URL}/events/
                      </span>
                    </div>
                    <input
                      type="text"
                      name="url"
                      value={event.url}
                      onChange={handleUrl}
                      className="form-control"
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Enter Blog Url"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mt-3 row">
                <label className="col-sm-2 mt-2 text-end">Speakers :</label>
                <div className="col-sm-10">
                  {event.speakers.map((a) => {
                    return (
                      <div className="form-group mb-2 row">
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
                  <div className="form-group row">
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
                      <button
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXspeakers}
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
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group align-items-center mt-3 row">
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
              <div className="form-group align-items-center mt-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Start Time :
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    className="form-control"
                    selected={new Date(event.eventStart)}
                    onChange={(date) => seteventStartDate(date)}
                    showTimeSelect
                    // minDate={new Date()}
                    filterTime={filterPassedTime}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
              <div className="form-group align-items-center mt-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  End Time :
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    className="form-control"
                    selected={new Date(event.eventEnd)}
                    onChange={(date) => seteventEndDate(date)}
                    showTimeSelect
                    // minDate={new Date()}
                    // filterTime={filterPassedTime}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
              <div className="form-group align-items-center mt-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Abstract :
                </label>
                <div className="col-sm-10">
                  <JoditEditor
                    className="jodit-editor-border"
                    name="content"
                    ref={editor}
                    value={event ? event.abstract : ""}
                    config={editorConfig}
                    onChange={handleValue}
                  />
                </div>
              </div>
              <div className="form-group align-items-center mt-3 row">
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
              <div className="form-group align-items-center mt-3 row">
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
                className="btn btn-primary mt-4"
                disabled={add}
              >
                {add ? <>Updating <i className="fa fa-spinner fa-spin"></i></> : <>Update</>}
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
