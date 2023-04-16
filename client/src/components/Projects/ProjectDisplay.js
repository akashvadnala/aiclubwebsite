import axios from "axios";
import React, { useRef, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { SERVER_URL } from "../../EditableStuff/Config";
import Error from "../Error";
import Loading from "../Loading";
import AuthorCard from "./AuthorCard";
import { NavLink } from "react-router-dom";
import Tag from "../Blogs/tags/Tag";
import { Helmet } from "react-helmet";
import JoditEditor from "jodit-react";
import { editorPreviewConfig } from "../Params/editorConfig";

const ProjectDisplay = () => {
  const { url } = useParams();
  const editor = useRef(null);
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  var project = null;
  const [proj, setProj] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [load, setLoad] = useState(0);
  const [edit, setEdit] = useState(false);
  // const [pub, setPub] = useState("Make Public");
  // const [pub2, setPub2] = useState();
  // const [approval, setApproval] = useState("");
  // const [approval2, setApproval2] = useState();

  const navigate = useNavigate();

  const getProject = async () => {
    try {
      const data = await axios.get(`${SERVER_URL}/getProject/${url}`);
      project = data.data.project;
      if (user && data.data.project.authors.indexOf(user._id) > -1) {
        setEdit(true);
      }
      setProj(data.data.project);
      setAuthors(data.data.authors);
      // setApproval(data.data.project.approvalStatus);
      // setPub(`${!data.data.project.public ? "Make Public" : "Make Private"}`);

      if (!project.public) {
        if (project.authors.indexOf(user._id) > -1 || user.isadmin) {
          setLoad(1);
        }
        else {
          setLoad(-1);
        }
      }
      else {
        setLoad(1);
      }
    } catch (err) {
      setLoad(-1);
    }
  };

  useEffect(() => {
    if (logged_in !== 0 && url) {
      getProject();
    }
  }, [logged_in, url]);

  useEffect(() => {

  }, [user, proj])

  const deleteProject = async (status) => {
    try {
      if (status) {
        const confirmed = window.confirm(
          `Are you sure to delete the project ${project.title}?`
        );
        if (confirmed) {
          await axios.put(`${SERVER_URL}/imgdelete`,
            { url: project.cover },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          const res = await axios.delete(`${SERVER_URL}/deleteProject/${proj._id}`, { withCredentials: true });
          showAlert("Project deleted successfully", "success");
          navigate("/projects");
        }
      }
    } catch (err) {
      showAlert(err.response.data.error, "danger");
    }

  };

  const TogglePublic = async (status) => {
    try {
      if (status) {
        // setPub(`${!proj.public ? "Publishing" : "Making Private"}`);
        // setPub2(<i className="fa fa-spinner fa-spin"></i>);
        proj.public = !proj.public;
        proj.approvalStatus = "Pending";
        const res = await axios.put(
          `${SERVER_URL}/updateprojPublicStatus/${proj.url}`,
          {
            public: proj.public,
            approvalStatus: proj.approvalStatus
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        proj.public = !proj.public ? true : false;
        showAlert(`Project made ${proj.public ? "public" : "private"}`, "success");
        // setPub(`${!proj.public ? "Make Public" : "Make Private"}`);
        // setPub2("");
        navigate(`/projects/${proj.url}`);

      }
    } catch (err) {
      showAlert(err.response.data.error, "danger");
    }

  };

  const ChangeApprovalStatus = async (status) => {
    try {
      if (proj.approvalStatus === "Draft") {
        if (status) {
          // setApproval("Pending");
          const res = await axios.put(
            `${SERVER_URL}/updateprojApprovalStatus/${proj.url}`,
            { approvalStatus: "Pending" },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          showAlert("Submitted for Admin approval", "success");
          setProj({ ...proj, approvalStatus: "Pending" });
          navigate(`/projects/${proj.url}`);
        }
      }
    } catch (err) {
      showAlert("Submission failed. PLease try again!", "danger");
    }
  };

  const ApproveOrReject = async (status) => {
    try {
      var response;
      if (status) {
        response = "Approved";
        // setPub("Make Private");
      } else {
        response = "Rejected";
      }
      // setApproval(response);
      const res = await axios.put(
        `${SERVER_URL}/updateprojApprovalStatus/${proj.url}`,
        { approvalStatus: response, public: status },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      showAlert(`${response === "Approved" ? "Approved & Published." : response}.`, "success");
      setProj({ ...proj, approvalStatus: response, public: status });
      navigate(`/projects/${proj.url}`);
    } catch (err) {
      showAlert("Response not recorded. Please try again", "success");
    }
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <>
          <div className="container projectdisplay-container py-5">
            <div className="row">
              <Helmet>
                <title>Projects - AI Club</title>
              </Helmet>
              <div className="col-lg-8 px-5">
                <div className="header d-flex justify-content-between mb-2">
                  <div>
                    <div className="text-header">
                      {proj.title}
                      {(edit || (user && user.isadmin)) && <span style={{ fontSize: "14px" }} className={`ml-2 px-2 align-middle text-light rounded bg-${proj.approvalStatus === "Pending" ? "warning" : proj.approvalStatus === "Approved" ? "success" : proj.approvalStatus === "Rejected" ? "danger" : "secondary"}`}>{proj.approvalStatus}</span>}
                    </div>
                  </div>
                  {(edit || (user && user.isadmin)) && (
                    <div className="align-bottom">
                      <div class="dropdown no-downmark">
                        <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                          </svg>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">

                          <>
                            {edit && (
                              <>
                                <NavLink to={`/projects/${proj.url}/edit`} className="dropdown-item" >Edit</NavLink>
                                <hr />
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#delete" className="dropdown-item" >Delete</button>
                              </>
                            )}
                            {user && user.isadmin && proj.approvalStatus === "Pending" && (
                              <>
                                {edit && <hr />}
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#exampleModal" className="dropdown-item">
                                  Approve/Reject
                                </button>
                              </>
                            )}
                            {edit && proj.approvalStatus === "Draft" && (
                              <>
                                <hr />
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#submitForApproval" className="dropdown-item">
                                  Submit
                                </button>
                              </>
                            )}
                            {user && user.isadmin && proj.approvalStatus === "Approved" && (
                              <>
                                {edit && <hr />}
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#publicOrPrivate" className="dropdown-item">
                                  Make {proj.public ? "Private" : "Public"}
                                </button>
                              </>
                            )}
                          </>
                        </div>
                      </div>
                    </div>

                  )}
                  {/* {(edit || (user && user.isadmin)) && (
                    <div className="text-center fs-6 p-2">
                      {edit && (
                        <NavLink to={`/projects/${proj.url}/edit`} className="btn btn-primary btn-sm mx-1">
                          Edit
                        </NavLink>
                      )}
                      {edit && (
                        <>
                          <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#delete" className="btn btn-danger btn-sm mx-1">
                            Delete
                          </button>
                        </>
                      )}
                      {user && user.isadmin && approval === "Pending" ? (
                        <>
                          <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#exampleModal"
                            className={`btn btn-${proj.approvalStatus === "submit"
                              ? "success"
                              : proj.approvalStatus === "Pending"
                                ? "warning"
                                : proj.approvalStatus === "Rejected"
                                  ? "danger"
                                  : "primary"
                              } btn-sm mx-1`}
                          >
                            Approve/Reject
                          </button>
                        </>
                      ) : proj.approvalStatus === "submit" ? (
                        <>
                          <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#submitForApproval"
                            className={`btn btn-${proj.approvalStatus === "submit"
                              ? "success"
                              : proj.approvalStatus === "Pending"
                                ? "warning"
                                : proj.approvalStatus === "Rejected"
                                  ? "danger"
                                  : "primary"
                              } btn-sm mx-1`}
                          >
                            {approval}
                          </button>
                        </>
                      ) : (
                        <button rel="noreferrer"
                          className={`btn btn-${proj.approvalStatus === "submit"
                            ? "success"
                            : proj.approvalStatus === "Pending"
                              ? "warning"
                              : proj.approvalStatus === "Rejected"
                                ? "danger"
                                : "primary"
                            } btn-sm mx-1`}
                        >
                          {approval}
                        </button>
                      )}
                      {user && user.isadmin && approval === "Approved" && (
                        <>
                          <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#publicOrPrivate"
                            className={`btn btn-${proj.public ? "warning" : "success"
                              } btn-sm mx-1 ${proj.approvalStatus === "Rejected" ? "disabled" : ""
                              }`}
                          >
                            {" "}
                            {pub}
                            {pub2}
                          </button>
                        </>
                      )}
                    </div>
                  )} */}
                </div>
                <JoditEditor
                  name="content"
                  className="mt-4"
                  ref={editor}
                  value={proj ? proj.content : ""}
                  config={editorPreviewConfig}
                />
                {proj.tags && (
                  <div className="blog-subCategory">
                    <div key={0}>
                      tags:
                    </div>
                    {proj.tags.map((t, i) => {
                      {
                        return (
                          <div key={i}>
                            <Tag label={t} />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="col-lg-4">
                {authors.map((a, i) => {
                  return (
                    <div key={i}>
                      <AuthorCard a={a} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="modal fade" id="delete" tabIndex="-1" aria-labelledby="deleteLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title fs-5" id="deleteLabel" >
                    Are you sure to delete the project "${proj.title}"?
                  </h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm" data-bs-dismiss="modal" >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" data-bs-dismiss="modal"
                    onClick={() => {
                      deleteProject(true);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title fs-5" id="exampleModalLabel" >
                    Approve or Reject
                  </h4>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      ApproveOrReject(true);
                    }}
                  >
                    Approve & Publish
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      ApproveOrReject(false);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="submitForApproval" tabIndex="-1" aria-labelledby="submitForApprovalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title fs-5" id="submitForApprovalLabel" >
                    Are you sure to submit project "{proj.title}" for Admin Approval ?
                  </h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm" data-bs-dismiss="modal" >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success btn-sm" data-bs-dismiss="modal"
                    onClick={() => {
                      ChangeApprovalStatus(true);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="publicOrPrivate" tabIndex="-1" aria-labelledby="publicOrPrivateLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title fs-5" id="publicOrPrivateLabel" >
                    {`Are you sure to make project "${proj.title
                      }" ${!proj.public ? "Public" : "Private"}?`}
                  </h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm" data-bs-dismiss="modal" >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success btn-sm" data-bs-dismiss="modal"
                    onClick={() => {
                      TogglePublic(true);
                    }} >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Error />
      )}
    </>
  );
};

export default ProjectDisplay;
