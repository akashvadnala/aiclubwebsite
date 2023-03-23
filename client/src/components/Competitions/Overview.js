import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useEffect, useRef, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import Error from "../Error";
import Loading from "../Loading";
import "./Inductions.css";
import { editorPreviewConfig } from "../Params/editorConfig";
import { editorConfig } from "../Params/editorConfig";

const Overview = ({ props }) => {
  const editor = useRef(null);
  const [preview, setPreview] = useState(true);
  const [overview, setOverview] = useState("");
  const [overview2, setOverview2] = useState("");
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
    setOverview(comp.overview);
    setOverview2(comp.overview);
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
  };

  const cancelIt = () => {
    setOverview(overview2);
    setPreview(true);
  };

  const saveIt = async () => {
    await axios.put(`${SERVER_URL}/editOverview/${props.c._id}`,
      { overview: overview },
      { withCredentials: true });
    setPreview(true);
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="overview-container pt-2">
          <div className="card">
            <div className="row p-3">
              <div className="col-sm-8">
                <h4 className="m-0">Overview</h4>
              </div>
              <div className="col-sm-4 text-end">
                {props.access ? (
                  preview ? (
                    <button
                      className="btn btn-primary btn-sm mx-1"
                      onClick={showEdit}
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm mx-1"
                        onClick={cancelIt}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm mx-1"
                        onClick={showPreview}
                      >
                        Preview
                      </button>
                      <button
                        className="btn btn-success btn-sm mx-1"
                        onClick={saveIt}
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
                  {/* <p dangerouslySetInnerHTML={{ __html: description }}></p> */}
                  <JoditEditor
                    name="content"
                    ref={editor}
                    value={overview}
                    config={editorPreviewConfig}
                  />
                </div>
              ) : (
                <JoditEditor
                  className="jodit-editor-border"
                  name="content"
                  ref={editor}
                  value={overview}
                  config={editorConfig}
                  onChange={(value) => {
                    setOverview(value);
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
