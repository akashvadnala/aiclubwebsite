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

const Evaluation = ({ props }) => {
  const [compete, setCompete] = useState(null);
  const [add, setAdd] = useState(false);
  const { showAlert } = useContext(alertContext);
  const [evaluation, setEvaluation] = useState({
    _id: "",
    name: "",
    description: "",
    code: ""
  });
  const [evaluations, setEvaluations] = useState(null);
  const [load, setLoad] = useState(0);
  const { logged_in } = useContext(Context);

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
            code: evaluation.code
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
    getEvaluationMetric(props.c.evaluation)
    getEvaluationMetrics();
  }, [logged_in, props]);

  console.log("evaluation", evaluation, compete);
  return (
    <>
      {load === 0 ? <Loading /> : load === 1 ?
        <>
          <div className='settings-container py-2'>
            <div className='card'>
              <div className='card-body pt-0 pb-4'>
                <div className="text-header  py-4">Evaluation Metric</div>
                <div className="text-secondary  py-4">
                  <ul>
                    <li>User submissions are evaluated by comparing their Submission file to the ground truth Solution file with respect to a chosen Scoring Metric.Each Scoring Metric will expect the Solution and Submission file to be in certain format.</li>
                    <li>To ensure that competitors cannot game the system, the solution file should be sampled into Public and Private. Public scores are shown on the public leaderboard, while only the private scores are used to determine the competition winner. The sampling should be done manually and upload two different files for both public and private data. </li>
                    <li>Ensure that each item in data should have a unique itentifier which can be taken as reference to write your evaluation code. Your evaluation logic should take submission file path, public solution data and private solution data as input and return both public and private scores.</li>
                  </ul>
                </div>
                <div className="form-group mt-3 row">
                  <label htmlFor="url" className="col-sm-2 mt-2 text-end">
                    Scoring Metric :
                  </label>
                  <div className="col-sm-10">
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
                {((compete.evaluation !== "select") && (compete.evaluation !== null)) &&
                  <AceEditor
                    placeholder="Create a custom evaluation function which takes filepaths of both ground truth and submission file."
                    mode="python"
                    theme="github"
                    name="blah2"
                    width="100%"
                    onChange={(newValue) => { setEvaluation({ ...evaluation, code: newValue }) }}
                    fontSize={20}
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
