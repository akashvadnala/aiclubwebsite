import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useEffect, useRef, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import Error from "../Error";
import Loading from "../Loading";
import "./Inductions.css";

const Overview = ({ props }) => {
  const editor = useRef(null);
  const [preview, setPreview] = useState(true);
  const [description, setDescription] = useState(props.c.description);
  const [dataset, setDataset] = useState(props.c.dataset);
  const [rules, setRules] = useState(props.c.rules);
  const [evaluation, setEvaluation] = useState(props.c.evaluation);
  const [load, setLoad] = useState(1);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    setPreview(true);
    console.log(description,props);
  }, [props.c]);

  const showPreview = () => {
    setPreview(true);
  };
  const showEdit = () => {
    setPreview(false);
  };

  // const saveIt = () => {
  //   axios.put(`${SERVER_URL}/editOverview/${overview._id}`, overview, {
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   setPreview(true);
  // };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="overview-container py-2">
          <div className="card">
            <div className="row py-3">
              <div className="col-sm-8">
                <h5 className="px-3">Overview</h5>
              </div>
              <div className="col-sm-4 text-end">
                {props.access ? (
                  preview ? (
                    <button
                      className="btn btn-dark btn-sm mx-1"
                      onClick={showEdit}
                    >
                      Edit {preview}
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-dark btn-sm mx-1"
                        onClick={showPreview}
                      >
                        Preview
                      </button>
                      <button
                        className="btn btn-dark btn-sm mx-1"
                        onClick={() => {
                          setDescription(desc);
                          setPreview(true);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-dark btn-sm mx-1"
                        // onClick={saveIt}
                      >
                        Save
                      </button>
                    </>
                  )
                ) : null}
              </div>
            </div>
            {preview ? (
              <div className="">
                <p dangerouslySetInnerHTML={{ __html: description }}></p>
              </div>
            ) : (
              <JoditEditor
                className="border"
                name="content"
                ref={editor}
                value={description}
                onChange={(value) => {
                  setDescription(value);
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default Overview;
