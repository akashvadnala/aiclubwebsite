import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from '../../../Context/Context';
import { SERVER_URL } from "../../../EditableStuff/Config";
import { alertContext } from "../../../Context/Alert";

const SandBoxSubbmission = ({ props }) => {
  let pollInterval;
  const { showAlert } = useContext(alertContext);
  const [compete, setCompete] = useState(null);
  const [sandBoxFile, setSandBoxFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { logged_in } = useContext(Context);

  const getCompete = async () => {
    await axios.get(`${SERVER_URL}/getCompeteDetails/${props.c._id}`).then((data) => {
      setCompete(data.data);
    })
  };

  const submitCompete = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const data = new FormData();
    data.append("sandBoxFile", sandBoxFile, `${Date.now()}-${sandBoxFile.name}`);
    data.append("compete", props.c._id);
    console.log('data', sandBoxFile);
    try {
      await axios.post(`${SERVER_URL}/submitSandBoxFile`, data, { withCredentials: true })
        .then(res => {
          document.getElementById("submitSandBoxModalClose").click();
          setSandBoxFile(null);
        })
      showAlert('File submitted successfully. Evaluation may take sometime..', "success");
      pollInterval = setInterval(async () => {
        await axios.get(`${SERVER_URL}/getSandBoxSubmissionStatus/${props.c._id}`).then((data) => {
          if (!data.data) {
            getCompete();
            clearInterval(pollInterval);
          }
        })
      }, 1000);
    } catch (err) {
      showAlert("Something went wrong!", "danger");
      console.log(err);
    }
    setSubmitLoading(false);
  }

  useEffect(() => {
    setCompete(props.c);
  }, [logged_in, props.c])
  return (
    <>
      <div className='settings-container py-2'>
        <div className='card'>
          <div className='card-body pt-0 pb-0'>
            <button className="btn btn-sm btn-dark my-4" data-bs-toggle="modal" data-bs-target="#SandBoxSubmitModal">Create SandBox Submission</button>
          </div>
          {compete && <div className='card m-3'>
            <div className='card-body pt-0 pb-0'>
              <div className="row">
                {compete.sandBoxPublicScore && <div className="col-4 text-center"><h6 className="pt-3">Public Score</h6><h3 className="p-2">{compete.sandBoxPublicScore['$numberDecimal'].toLocaleString()}</h3></div>}
                {compete.sandBoxPrivateScore && <div className="col-4 text-center"><h6 className="pt-3">Private Score</h6><h3 className="p-2">{compete.sandBoxPrivateScore['$numberDecimal'].toLocaleString()}</h3></div>}
                {(compete.sandBoxSubmissionLog !== null) &&
                  <div className="col-4 text-center"><h6 className="pt-3">Submission Log</h6><h3 className="p-2" data-bs-toggle="modal" data-bs-target="#sandBoxSubmissionLog" type="button">{(compete.sandBoxSubmissionLog === "") ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check2-circle" viewBox="0 0 16 16" style={{ "color": "green" }}>
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                  </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16" style={{ "color": "red" }}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                  </svg>}</h3></div>
                }
              </div>
            </div>
          </div>}
        </div>
        <div className="modal fade" id="SandBoxSubmitModal" tabIndex="-1" aria-labelledby="SandBoxSubmitModalLabel contained-modal-title-vcenter" aria-hidden="true" >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-5">
              <h4 className="text-center">Make SandBox Submission</h4>
              <div className="modal-body">
                <div className="login-container">
                  <form method="POST" onSubmit={submitCompete} encType="multipart/form-data">
                    <div className="form-group mb-3 text-start">
                      <div>
                        <input type='file'
                          // accept="image/*"
                          name="sandBoxFile"
                          onChange={(e) => setSandBoxFile(e.target.files[0])}
                          className="form-control rounded-pill py-2 px-4"
                          id='sandBoxFile'
                          onClick={(e) => { e.target.value = null }}
                          aria-describedby='sandBoxFile'
                          required
                          hidden />
                        <label htmlFor="sandBoxFile" className={`form-control rounded-pill py-2 px-4 mb-4 ${!sandBoxFile ? "text-muted" : "text-dark"}`}>{sandBoxFile ? sandBoxFile.name : <>Choose File</>}</label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 px-4"
                      disabled={submitLoading}
                    >
                      {submitLoading ? <>Submitting <i className="fa fa-spinner fa-spin"></i></> : <>Submit</>}
                    </button>
                  </form>
                  <button type="reset" id="submitSandBoxModalClose" className="btn btn-sm" data-bs-dismiss="modal" hidden>Close</button>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="modal fade" id="sandBoxSubmissionLog" tabIndex="-1" aria-labelledby="sandBoxSubmissionLog contained-modal-title-vcenter" aria-hidden="true" >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content p-5">
              <h4 className="text-center">SandBox Submission Log</h4>
              <div className="modal-body text-center">
                {compete && (compete.sandBoxSubmissionLog === "" ? "Evaluation completed successfully" : compete.sandBoxSubmissionLog)}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SandBoxSubbmission
