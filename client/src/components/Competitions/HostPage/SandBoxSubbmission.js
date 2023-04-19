import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from '../../../Context/Context';
import { SERVER_URL } from "../../../EditableStuff/Config";
import { alertContext } from "../../../Context/Alert";

const SandBoxSubbmission = ({ props }) => {

  const { showAlert } = useContext(alertContext);
  const [compete, setCompete] = useState(null);
  const [sandBoxFile, setSandBoxFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { logged_in } = useContext(Context);

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
          <div className='card m-3'>
            <div className='card-body pt-0 pb-0'>
              <div className="row">
                <div className="col-4 text-center"><h4 className="p-3">Public Score</h4><h4 className="p-3"></h4></div>
                <div className="col-4 text-center"><h4 className="p-3">Private Score</h4><h4 className="p-3"></h4></div>
                <div className="col-4 text-center"><h4 className="p-3">Submission Log</h4><h4 className="p-3"></h4></div>
              </div>
            </div>
          </div>
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
                          // value={sandBoxFile}
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
      </div>
    </>
  )
}

export default SandBoxSubbmission
