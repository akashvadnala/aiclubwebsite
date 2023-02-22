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
  const [description, setDescription] = useState("");
  const [description2, setDescription2] = useState("");
  const [dataset, setDataset] = useState("");
  const [dataset2, setDataset2] = useState("");
  const [rules, setRules] = useState("");
  const [rules2, setRules2] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [evaluation2, setEvaluation2] = useState("");
  const [load, setLoad] = useState(0);
  const [save, setSave] = useState(false);

  useEffect(() => {
    const comp = props.c;
    setDescription(comp.description);
    setDataset(comp.dataset);
    setRules(comp.rules);
    setEvaluation(comp.evaluation);
    setLoad(1);
  }, [props]);

  const showPreview = () => {
    setPreview(true);
  };

  const showEdit = () => {
    setPreview(false);
    setDescription2(description);
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
                      Edit
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
                          setDescription(description2);
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
            <div className="card-body border-top">
              {preview ? (
                <div className="">
                  <p dangerouslySetInnerHTML={{ __html: description }}></p>
                </div>
              ) : (
                <JoditEditor
                  className=""
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
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default Overview;
