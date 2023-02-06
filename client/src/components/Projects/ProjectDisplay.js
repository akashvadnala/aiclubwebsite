import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
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

const ProjectDisplay = () => {
  const { url } = useParams();
  const { user } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  var project = null;
  const [proj, setProj] = useState();
  const [authors, setAuthors] = useState([]);
  const [load, setLoad] = useState(0);
  const [edit, setEdit] = useState(false);
  const [pub, setPub] = useState("Make Public");
  const [pub2, setPub2] = useState();
  const [approval, setApproval] = useState("");
  const [approval2, setApproval2] = useState();

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
      setApproval(data.data.project.approvalStatus);
      setPub(`${!data.data.project.public ? "Make Public" : "Make Private"}`);
      setLoad(1);
    } catch (err) {
      setLoad(-1);
    }
  };

  useEffect(() => {
    getProject();
  }, [user, url]);

  const deleteProject = async (status) => {
    try {
      if (status) {
        const res = await axios.delete(`${SERVER_URL}/deleteProject/${proj._id}`,{withCredentials:true});
        showAlert("Project deleted successfully", "success");
        navigate("/projects");
      }
    } catch (err) {
      showAlert(err.response.data.error, "danger");
    }

  };

  const TogglePublic = async (status) => {
    try {
      if (status) {
        setPub(`${!proj.public ? "Publishing" : "Making Private"}`);
        setPub2(<i className="fa fa-spinner fa-spin"></i>);
        const res = await axios.put(
          `${SERVER_URL}/updateprojPublicStatus/${proj.url}`,
          { public: !proj.public ? true : false },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        proj.public = !proj.public ? true : false;
        showAlert(`Project made ${proj.public ? "public" : "private"}`, "success");
        setPub(`${!proj.public ? "Make Public" : "Make Private"}`);
        setPub2();
        navigate(`/projects/${proj.url}`);

      }
    } catch (err) {
      showAlert(err.response.data.error, "success");
    }

  };

  const ChangeApprovalStatus = async (status) => {
    try {
      if (proj.approvalStatus === "submit") {
        if (status) {
          setApproval("pending");
          setApproval2(<i className="fa fa-spinner fa-spin"></i>);
          const res = await axios.put(
            `${SERVER_URL}/updateprojApprovalStatus/${proj.url}`,
            { approvalStatus: "pending" },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          showAlert("Submitted for Admin approval", "success");
          setProj({ ...proj, ["approvalStatus"]: "pending" });
          setApproval2();
          navigate(`/projects/${proj.url}`);
        }
      }
    } catch (err) {
      showAlert("Submission failed. PLease try again!", "danger");
    }
  };

  const ApproveOrReject = async (status) => {
    var response;
    if (status) {
      response = "Approved";
      setPub("Make Private");
    } else {
      response = "Rejected";
    }
    setApproval(response);
    setApproval2(<i className="fa fa-spinner fa-spin"></i>);
    const res = await axios.put(
      `${SERVER_URL}/updateprojApprovalStatus/${proj.url}`,
      { approvalStatus: response, public: status },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.status === 200) {
      showAlert(`${response === "Approved" ? "Approved & Published." : response}.`, "success");
      setProj({ ...proj, ["approvalStatus"]: response, ["public"]: status });
      setApproval2();
      navigate(`/projects/${proj.url}`);
    } else {
      showAlert("Response not recorded. Please try again", "success");
    }
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container projectdisplay-container py-5">
          <div className="row">
            <Helmet>
              <title>Projects - AI Club</title>
            </Helmet>
            <div className="col-lg-8 px-5">
              <div className="header align-center">
                <h3 className="text-center pb-1">{proj.title}</h3>
                {(edit || (user && user.isadmin)) && (
                  <div className="text-center fs-6 p-2">
                    {edit && (
                      <NavLink
                        to={`/projects/${proj.url}/edit`}
                        className="btn btn-primary btn-sm  mx-1"
                      >
                        Edit{" "}
                      </NavLink>
                    )}
                    {edit && (
                      <>
                        <NavLink
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#delete"
                          className="btn btn-danger btn-sm  mx-1"
                        >
                          {" "}
                          Delete
                        </NavLink>
                        <div
                          className="modal fade"
                          id="delete"
                          tabIndex="-1"
                          aria-labelledby="deleteLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id="deleteLabel"
                                >
                                  {`Are you sure to delete the project "${proj.title}"?`}
                                </h1>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  No
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-dismiss="modal"
                                  onClick={() => {
                                    deleteProject(true);
                                  }}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {user && user.isadmin && approval === "pending" ? (
                      <>
                        <NavLink
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          className={`btn btn-${proj.approvalStatus === "submit"
                            ? "success"
                            : proj.approvalStatus === "pending"
                              ? "warning"
                              : proj.approvalStatus === "Rejected"
                                ? "danger"
                                : "primary"
                            } btn-sm mx-1`}
                        >
                          {" "}
                          {"Approve/Reject"}
                          {approval2}
                        </NavLink>
                        <div
                          className="modal fade"
                          id="exampleModal"
                          tabIndex="-1"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  Approve or Reject
                                </h1>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-dismiss="modal"
                                  onClick={() => {
                                    ApproveOrReject(true);
                                  }}
                                >
                                  Approve & Publish
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
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
                      </>
                    ) : proj.approvalStatus === "submit" ? (
                      <>
                        <NavLink
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#submitForApproval"
                          className={`btn btn-${proj.approvalStatus === "submit"
                            ? "success"
                            : proj.approvalStatus === "pending"
                              ? "warning"
                              : proj.approvalStatus === "Rejected"
                                ? "danger"
                                : "primary"
                            } btn-sm mx-1`}
                        >
                          {" "}
                          {approval}
                          {approval2}
                        </NavLink>
                        <div
                          className="modal fade"
                          id="submitForApproval"
                          tabIndex="-1"
                          aria-labelledby="submitForApprovalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id="submitForApprovalLabel"
                                >
                                  {`Are you sure to submit project "${proj.title}" for Admin Approval ?`}
                                </h1>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  No
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-dismiss="modal"
                                  onClick={() => {
                                    ChangeApprovalStatus(true);
                                  }}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <NavLink
                        rel="noreferrer"
                        className={`btn btn-${proj.approvalStatus === "submit"
                          ? "success"
                          : proj.approvalStatus === "pending"
                            ? "warning"
                            : proj.approvalStatus === "Rejected"
                              ? "danger"
                              : "primary"
                          } btn-sm mx-1`}
                      >
                        {" "}
                        {approval}
                        {approval2}
                      </NavLink>
                    )}
                    {user && user.isadmin && approval === "Approved" && (
                      <>
                        <NavLink
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#publicOrPrivate"
                          className={`btn btn-${proj.public ? "warning" : "success"
                            } btn-sm mx-1 ${proj.approvalStatus === "Rejected" ? "disabled" : ""
                            }`}
                        >
                          {" "}
                          {pub}
                          {pub2}
                        </NavLink>
                        <div
                          className="modal fade"
                          id="publicOrPrivate"
                          tabIndex="-1"
                          aria-labelledby="publicOrPrivateLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id="publicOrPrivateLabel"
                                >
                                  {`Are you sure to make project "${proj.title
                                    }" ${!proj.public ? "Public" : "Private"}?`}
                                </h1>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  No
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-dismiss="modal"
                                  onClick={() => {
                                    TogglePublic(true);
                                  }}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {proj.tags && (
                  <div
                    className="text-center mb-2"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
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
              <p dangerouslySetInnerHTML={{ __html: proj.content }}></p>
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
      ) : (
        <Error />
      )}
    </>
  );
};

export default ProjectDisplay;
