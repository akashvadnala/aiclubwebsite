import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SERVER_URL } from "../EditableStuff/Config";
import { Context } from "../Context/Context";
import Error from "./Error";
import Loading from "./Loading";
import "./About.css";

const About = () => {
  const editor = useRef(null);
  const { user } = useContext(Context);
  const [preview, setPreview] = useState(true);
  const [overview, setOverview] = useState();
  const [load, setLoad] = useState(0);
  const [desc, setDesc] = useState("");
  const getOverview = () => {
    axios.get(`${SERVER_URL}/getAbout/`).then((data) => {
      if (data.status === 200) {
        setOverview(data.data);
        setDesc(data.data.about);
        setLoad(1);
      } else {
        setLoad(-1);
      }
    });
  };
  useEffect(() => {
    getOverview();
    setPreview(true);
  }, [user]);

  const handleValue = (value) => {
    setOverview({ ...overview, ["about"]: value });
  };
  const showPreview = () => {
    setPreview(true);
  };
  const showEdit = () => {
    setPreview(false);
  };
  const cancelIt = () => {
    setOverview({ ...overview, ["about"]: desc });
    setPreview(true);
  };
  const saveIt = () => {
    console.log("before saving", overview);
    axios.put(`${SERVER_URL}/updateAbout`, overview, {
      headers: { "Content-Type": "application/json" },
    });
    setPreview(true);
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="compete-container">
          <div className="adjust" style={{ overflow: "hidden" }}>
            <div className="overview-container">
              <div className="border">
                <div className="row p-3 pb-1">
                  <div className="col-sm-8">
                    <h5>
                      <strong>About</strong>
                    </h5>
                  </div>
                  <div className="col-sm-4 text-end">
                    {user ? (
                      user.isadmin && preview ? (
                        <>
                          <button
                            className="btn btn-outline-dark btn-sm mx-1"
                            onClick={showEdit}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-dark btn-sm mx-1"
                            onClick={saveIt}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline-dark btn-sm mx-1"
                            onClick={showPreview}
                          >
                            Preview
                          </button>
                          <button
                            className="btn btn-outline-dark btn-sm mx-1"
                            onClick={cancelIt}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-outline-dark btn-sm mx-1"
                            onClick={saveIt}
                          >
                            Save
                          </button>
                        </>
                      )
                    ) : null}
                  </div>
                </div>
                {preview ? (
                  <div className="p-3">
                    <p dangerouslySetInnerHTML={{ __html: overview.about }}></p>
                  </div>
                ) : (
                  <JoditEditor
                    name="content"
                    ref={editor}
                    value={overview.about}
                    onChange={handleValue}
                  />
                )}
                <div className="p-3">
                  <h5>
                    <strong>About</strong>
                  </h5>
                  <div>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.179525211182!2d75.93149181532856!3d11.321585291953028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2bb691caf%3A0xe14dc0a5771fd2ce!2sCentral%20Computer%20Center!5e0!3m2!1sen!2sin!4v1674127152405!5m2!1sen!2sin"
                      width="100%"
                      height="600"
                      style={{border:"0"}}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default About;
