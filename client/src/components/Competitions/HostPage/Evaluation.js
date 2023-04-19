import React, { useContext, useEffect, useState } from 'react'
import AceEditor from "react-ace";
import axios from 'axios';
import { SERVER_URL } from '../../../EditableStuff/Config';
import Error from '../../Error';
import Loading from '../../Loading';
import { Context } from '../../../Context/Context';
import { alertContext } from '../../../Context/Alert';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import Directory from "./Directory";

const Evaluation = ({ props }) => {
  const [compete, setCompete] = useState(null);
  const [files, setFiles] = useState(null);
  const [submissionFiles, setSubmissionFiles] = useState(null);
  const [add, setAdd] = useState(false);
  const { showAlert } = useContext(alertContext);
  const [dataSetLoading, setDataSetLoading] = useState(false);
  const [evaluation, setEvaluation] = useState({
    _id: "",
    name: "",
    description: "",
    code: ""
  });
  const [evaluations, setEvaluations] = useState(null);
  const [load, setLoad] = useState(0);
  const { logged_in } = useContext(Context);
  const [privateDataSet, setPrivateDataSet] = useState(null);
  const [publicDataSet, setPublicDataSet] = useState(null);
  const [sandBoxSubmission, setSandBoxSubmission] = useState(null);
  const uploadDataSet = async () => {
    setDataSetLoading(true);
    try {
      if (privateDataSet) {
        let data = new FormData();
        data.append("privateDataSet", privateDataSet, `${props.c._id}-privateDataSet.${privateDataSet.name.split(".").pop()}`);
        await axios.put(`${SERVER_URL}/uploadPrivateDataset/${props.c._id}`,
          data,
          { withCredentials: true })
          .then(res => {
            setPrivateDataSet(null);
            showAlert("Private Dataset Uploaded!", "success");
          })
        setPrivateDataSet(null);
      }
      if (publicDataSet) {
        let data = new FormData();
        data.append("publicDataSet", publicDataSet, `${props.c._id}-publicDataSet.${publicDataSet.name.split(".").pop()}`);
        await axios.put(`${SERVER_URL}/uploadPublicDataSet/${props.c._id}`,
          data,
          { withCredentials: true })
          .then(res => {
            setPublicDataSet(null);
            showAlert("Public Dataset Uploaded!", "success");
          })
        setPublicDataSet(null);
      }
    } catch (err) {
      console.log('dataseterr', err);
      showAlert("Something went wrong!", "danger");
    }
    setDataSetLoading(false);
  }

  const uploadSandBoxSubmission = async () => {
    try {
      if (sandBoxSubmission) {
        let data = new FormData();
        data.append("sandBoxSubmission", sandBoxSubmission, `${props.c._id}-sandBoxSubmission.${sandBoxSubmission.name.split(".").pop()}`);
        await axios.put(`${SERVER_URL}/uploadSandBoxSubmission/${props.c._id}`,
          data,
          { withCredentials: true })
          .then(res => {
            setSandBoxSubmission(null);
            showAlert("SandBox Submission Submitted!", "success");
          })
      }
    } catch (err) {
      console.log('submissionerr', err);
      showAlert("Something went wrong!", "danger");
    }
  }

  const getEvaluationMetrics = () => {
    try {
      axios.get(`${SERVER_URL}/getEvaluationMetrics`, { withCredentials: true }).then(async (data) => {
        setEvaluations(data.data);
        setLoad(1);
      });
    } catch (err) {
      console.log(err);
      setLoad(-1);
    }
  };
  const getEvaluationMetric = (id) => {
    if ((id == "select") || (id == "custom") || (id == null)) {
      setEvaluation({
        ...evaluation,
        _id: "",
        name: "",
        description: "",
        code: ""
      })
    } else {
      try {
        axios.get(`${SERVER_URL}/getEvaluationMetric/${id}`, { withCredentials: true }).then(async (data) => {
          setEvaluation(data.data);
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const updateCompetetion = async () => {
    if (evaluation._id === "") {
      try {
        const data = await axios.post(`${SERVER_URL}/addEvaluationMetric`,
          {
            name: evaluation.name,
            description: evaluation.description,
            code: evaluation.code,
            localFilePath: `/celery_tasks/EvaluationFiles/${evaluation.name}.py`
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }
        );
        setCompete({ ...compete, evaluation: data.data.id });
        showAlert("Metric added Successfully!", "success");
        setAdd(true);
        await axios.put(`${SERVER_URL}/updateCompetetion/${compete._id}`,
          { evaluation: data.data.id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }
        );
        showAlert("Competition Updated Successfully!", "success");
      }
      catch (err) {
        showAlert(err.response.data.error, "danger");
      }
    }
    else {
      try {
        await axios.put(`${SERVER_URL}/updateEvaluationMetric/${evaluation._id}`,
          evaluation,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }
        );
        showAlert("Evaluation Metric updated sucessfully!", "success");
        setAdd(true);
        await axios.put(`${SERVER_URL}/updateCompetetion/${compete._id}`,
          compete,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }
        );
        showAlert("Competition Updated Successfully!", "success");
      } catch (err) {
        showAlert(err.response.data.error, "danger");
      }
    }
    getEvaluationMetrics();
    setAdd(false);
  }

  useEffect(() => {
    setCompete(props.c);
    try {
      if (props.c.DataSetTree) {
        setFiles(JSON.parse(props.c.DataSetTree));
      }
      if (props.c.SubmissionTree) {
        setSubmissionFiles(JSON.parse(props.c.SubmissionTree));
      }
      getEvaluationMetric(props.c.evaluation);
      getEvaluationMetrics();
    } catch (err) {
      console.log(err);
    }
  }, [logged_in, props]);
  return (
    <>
      {load === 0 ? <Loading /> : load === 1 ?
        <>
          <div className='settings-container py-2'>
            <div className='card'>
              <div className='card-body pt-0 pb-4'>
                <div className="text-header py-4">Evaluation</div>
                <div className="datasets mb-5">
                  <h4>Datasets</h4>
                  <div className='private-dataset row mt-3'>
                    <div className="form-group align-items-center row">
                      <label htmlFor='publicDataSet' className='col-sm-4 text-end'>Public Dataset :</label>
                      <div className='col-sm-6'>
                        <input type='file' name="publicDataSet" onChange={(e) => { setPublicDataSet(e.target.files[0]) }} className="form-control" id='publicDataSet' aria-describedby='publicDataSet' />
                      </div>
                    </div>
                  </div>
                  <div className='public-dataset row mt-3'>
                    <div className="form-group align-items-center row">
                      <label htmlFor='privateDataSet' className='col-sm-4 text-end'>Private Dataset :</label>
                      <div className='col-sm-6'>
                        <input type='file' name="privateDataSet" onChange={(e) => { setPrivateDataSet(e.target.files[0]) }} className="form-control" id='privateDataSet' aria-describedby='privateDataSet' />
                      </div>
                    </div>
                  </div>
                  <div className='mt-3'>
                    <button className='btn btn-primary' onClick={uploadDataSet} disabled={dataSetLoading}>
                      {
                        dataSetLoading ?
                          <>
                            Uploading <i className="fa fa-spinner fa-spin"></i>
                          </>
                          :
                          <>Upload Datasets</>
                      }
                    </button>
                  </div>
                </div>
                <div className="datasets">
                  <h4>SandBox Submission</h4>
                  <div className='sandbox-submission row mt-3'>
                    <div className="form-group align-items-center row">
                      <div className='col-sm-6'>
                        <input type='file' name="sandboxSubmission" onChange={(e) => { setSandBoxSubmission(e.target.files[0]) }} className="form-control" id='sandboxSubmission' aria-describedby='sandboxSubmission' />
                      </div>
                    </div>
                  </div>
                  <div className='mt-3'>
                    <button className='btn btn-primary' onClick={uploadSandBoxSubmission}>Submit</button>
                  </div>
                </div>
                <div className='mt-5'>
                  <strong>Note:</strong>
                  <div>
                  Datasets folder and Submissions folder present in same folder. So to get relative paths of files of datasets folder and submissions folder, upload datasets and sandbox submission files before writing evaluate code.
                  </div>
                  <div className='mt-3 border-bottom border-start border-end'>
                    {files && <Directory files={files} order={1} />}
                  </div>
                  <div className='mt-3 border-bottom border-start border-end'>
                    {submissionFiles && <Directory files={submissionFiles} order={1} />}
                  </div>
                </div>

                <div className='mt-4'>
                  <p>publicDataSetPath : <strong>{!compete.publicDataSetPath ? "Upload public dataset to get an idea about publicDataSetPath" : compete.publicDataSetPath}</strong></p>
                  <p>privateDataSetPath : <strong>{!compete.privateDataSetPath ? "Upload private dataset to get an idea about privateDataSetPath" : compete.privateDataSetPath}</strong></p>
                  <p>submissionPath : <strong>{!compete.sandBoxSubmissionPath ? "Make a Sand Box Submission to get an idea about submissionPath" : compete.sandBoxSubmissionPath}</strong></p>
                </div>
                <div className="mt-5">
                  <h4>Evaluation Metric</h4>
                  <ul>
                    <li>User submissions are evaluated by comparing their Submission file to the ground truth Solution file with respect to a chosen Scoring Metric.Each Scoring Metric will expect the Solution and Submission file to be in certain format.</li>
                    <li>To ensure that competitors cannot game the system, the solution file should be sampled into Public and Private. Public scores are shown on the public leaderboard, while only the private scores are used to determine the competition winner. The sampling should be done manually and upload two different files for both public and private data. </li>
                    <li>Ensure that each item in data should have a unique itentifier which can be taken as reference to write your evaluation code. Your evaluation logic should take submission file path, public solution data and private solution data as input and return both public and private scores.</li>
                    <li>Make sure that the evaluation function should have a name "evaluate" which accepts three arguments as shown below.</li>
                  </ul>
                </div>
                <div className="form-group mt-4 d-flex">
                  <label htmlFor="url" className="mt-2 text-end">
                    Scoring Metric :
                  </label>
                  <div>
                    <div className="form-group row align-items-center">
                      <div className="col col-9">
                        <select
                          name="metric"
                          value={compete.evaluation}
                          onChange={(e) => {
                            setCompete({ ...compete, evaluation: e.target.value });
                            getEvaluationMetric(e.target.value);
                          }}
                          className="form-select"
                          aria-label="authors"
                        >
                          <option value="select">--Select Evaluation Metric--</option>
                          {evaluations.map((t, i) => {
                            return <option value={t._id} key={i} selected={(t._id === compete.evaluation) ? true : false}>{t.name}</option>;
                          })}
                          <option value="custom">Custom Evaluation Metric</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='my-4'>
                  Example Code:
                  <div className='text-white bg-dark p-3 rounded'>
                    <code className='text-light h6'>def evaluate(submissionPath,privateDataPath,publicDataPath):</code>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Your Evaluation Logic
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code className='text-light h6'>return public_score, private_score</code>
                    <br />
                    <br />
                    # Make sure that the evaluation function should have a name "evaluate" which accepts three arguments
                    <br />
                    # Make sure that the evaluation function returns public score and private score. Ensure that the public score is returned first and private score next.
                  </div>
                </div>


                {((compete.evaluation !== "select") && (compete.evaluation !== null)) &&
                  <AceEditor
                    // placeholder="Create a custom evaluation function which takes filepaths of both ground truth and submission file."
                    placeholder='Follow the above given example code...'
                    mode="python"
                    theme="github"
                    name="blah2"
                    width="100%"
                    // height="30px"
                    className='rounded border'
                    onChange={(newValue) => { setEvaluation({ ...evaluation, code: newValue }) }}
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    wrapEnabled={true}
                    highlightActiveLine={true}
                    value={evaluation.code}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: false,
                      showLineNumbers: true,
                      tabSize: 2,
                    }} />
                }
                {((compete.evaluation !== "select") && (compete.evaluation !== null)) &&
                  <>
                    <div className="form-group mt-3 row align-items-center">
                      <label htmlFor="subtitle" className="col-sm-2 text-end">
                        Scoring Metric :
                      </label>
                      <div className="col-sm-10">
                        <input
                          name="metricname"
                          onChange={(e) => { setEvaluation({ ...evaluation, name: e.target.value }) }}
                          className="form-control"
                          id="metricname"
                          aria-describedby="metricname"
                          value={evaluation.name}
                          placeholder={`Enter Scoring Metric Name`}
                        />
                      </div>
                    </div>
                    <div className="form-group mt-3 row align-items-center">
                      <label htmlFor="subtitle" className="col-sm-2 text-end">
                        Scoring Metric Description :
                      </label>
                      <div className="col-sm-10">
                        <input
                          name="metricdesc"
                          onChange={(e) => { setEvaluation({ ...evaluation, description: e.target.value }) }}
                          className="form-control"
                          id="metricdesc"
                          aria-describedby="metricdesc"
                          value={evaluation.description}
                          placeholder={`Give a brief description about the scoring metric`}
                        />
                      </div>
                    </div>
                  </>}
                <div className='p-4'>
                  <button className='btn btn-primary' onClick={updateCompetetion}>{add ? <>Updating <i className="fa fa-spinner fa-spin"></i></> : <>Update</>}</button>
                </div>
              </div>
            </div>
          </div>
        </>
        : <Error />}
    </>
  )
}

export default Evaluation
