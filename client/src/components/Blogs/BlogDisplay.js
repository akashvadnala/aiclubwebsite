import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import EmptyList from "./search/EmptyList";
import { useNavigate } from "react-router-dom";
import "./BlogDisplay.css";
import ProfileCard from "./profile/ProfileCard";
import Tag from "./tags/Tag";
import axios from "axios";
import Loading from "../Loading";
import { SERVER_URL } from "../../EditableStuff/Config";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const BlogDisplay = () => {
  const params = new useParams();
  const url = params.url;
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [blog, setBlog] = useState(null);
  const [edit, setedit] = useState(null);
  const [load, setLoad] = useState(0);
  const [authordetails, setauthordetails] = useState(null);
  const [pub, setPub] = useState("Make Public");
  const [pub2, setPub2] = useState();
  const [approval, setApproval] = useState("");
  const [approval2, setApproval2] = useState();
  const navigate = useNavigate();

  const getBlog = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/blogs/getBlog/${url}`);
      if (res.status === 200) {
        const post_ = res.data.blog;
        setBlog(res.data.blog);
        setauthordetails(res.data.author);
        setApproval(res.data.blog.approvalStatus);
        setPub(`${!res.data.blog.public ? "Make Public" : "Make Private"}`);
        setLoad(1);
        if (user && post_.authorName === user._id) {
          setedit(true);
        } else {
          setedit(false);
        }
      }
    } catch (err) {
      console.log(err);
      setLoad(-1);
      setedit(false);
      showAlert(`${err.response.data.error}`, "danger");
      navigate('/error');
    }
  };

  useEffect(() => {
    if (url) {
      getBlog();
    }
  }, [user, url]);

  const returnDDMMYYYY = (inp) => {
    const d = new Date(inp);
    const a =
      d.getDate() +
      "/" +
      String(parseInt(d.getMonth()) + 1) +
      "/" +
      d.getFullYear();
    return a;
  };

  const TogglePublic = async (status) => {
    try {
      if (status) {
        setPub(`${!blog.public ? "Publishing" : "Making Private"}`);
        setPub2(<i className="fa fa-spinner fa-spin"></i>);
        const res = await axios.put(
          `${SERVER_URL}/blogs/updateblogPublicStatus/${blog.url}`,
          { public: !blog.public ? true : false },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        blog.public = !blog.public ? true : false;
        showAlert(`Blog made ${blog.public ? "public" : "private"}`, "success");
        setPub(`${!blog.public ? "Make Public" : "Make Private"}`);
        setPub2();
        navigate(`/blogs/${blog.url}`);
      }
    } catch (error) {
      showAlert(`${error.response.data.error}`, "danger");
      navigate('/blogs');
    }
  };

  const deleteBlog = async (status) => {
    if (status) {
      try {
        const res = await axios.delete(`${SERVER_URL}/blogs/deleteBlog/${blog._id}`, { withCredentials: true });
        if (res.status === 200) {
          showAlert("Blog deleted successfully", "success");
          navigate("/myblogs");
        }
      } catch (error) {
        showAlert("Blog Deletion failed", "danger");
      }
    }
  };

  const ChangeApprovalStatus = async (status) => {
    try {
      if (blog.approvalStatus === "submit") {
        if (status) {
          setApproval("pending");
          setApproval2(<i className="fa fa-spinner fa-spin"></i>);
          const res = await axios.put(
            `${SERVER_URL}/blogs/updateblogApprovalStatus/${blog.url}`,
            { approvalStatus: "pending" },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          showAlert("Submitted for Admin approval", "success");
          setBlog({ ...blog, ["approvalStatus"]: "pending" });
          setApproval2();
          navigate(`/blogs/${blog.url}`);
        }
      }
    } catch (error) {
      showAlert(`${error.response.data.error}`, "danger");
    }

  };

  const ApproveOrReject = async (status) => {

    try {
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
        `${SERVER_URL}/blogs/updateblogApprovalStatus/${blog.url}`,
        { approvalStatus: response, public: status },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      showAlert(`${response === "Approved" ? "Approved & Published." : response}.`, "success");
      setBlog({ ...blog, ["approvalStatus"]: response, ["public"]: status });
      setApproval2();
      navigate(`/blogs/${blog.url}`);
    } catch (error) {
      showAlert(`${error.response.data.error}`, "danger");
    }
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container blogdisplay-container py-5">
          <div className="row">
            <Helmet>
              <title>Blogs - AI Club</title>
            </Helmet>
            <div className="col-lg-8 px-5">
              <div className="header align-center">
                <h3 className="text-center pb-1">{blog.title}</h3>
                <p className="blog-date text-center pb-1">
                  Published on {returnDDMMYYYY(blog.createdAt)}
                </p>
                {(edit || (user && user.isadmin)) && (
                  <div className="text-center fs-6 p-2">
                    {edit && (
                      <NavLink
                        to={`/blogs/${blog.url}/edit`}
                        className="btn btn-primary btn-sm mx-1"
                      >
                        Edit{" "}
                      </NavLink>
                    )}
                    {edit && (
                      <>
                        <button
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#delete"
                          className="btn btn-danger btn-sm mx-1"
                        >
                          {" "}
                          Delete
                        </button>
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
                                  {`Are you sure to delete the blog "${blog.title}"?`}
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
                                    deleteBlog(true);
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
                        <button
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#approveOrReject"
                          className={`btn btn-${blog.approvalStatus === "submit"
                            ? "success"
                            : blog.approvalStatus === "pending"
                              ? "warning"
                              : blog.approvalStatus === "Rejected"
                                ? "danger"
                                : "primary"
                            } btn-sm mx-1`}
                        >
                          {" "}
                          {"Approve/Reject"}
                          {approval2}
                        </button>
                        <div
                          className="modal fade"
                          id="approveOrReject"
                          tabIndex="-1"
                          aria-labelledby="approveOrRejectLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id="approveOrRejectLabel"
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
                    ) : blog.approvalStatus === "submit" ? (
                      <>
                        <button
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#submitForApproval"
                          className={`btn btn-${blog.approvalStatus === "submit"
                            ? "success"
                            : blog.approvalStatus === "pending"
                              ? "warning"
                              : blog.approvalStatus === "Rejected"
                                ? "danger"
                                : "primary"
                            } btn-sm mx-1`}
                        >
                          {" "}
                          {approval}
                          {approval2}
                        </button>
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
                                  {`Are you sure to submit blog "${blog.title}" for Admin Approval ?`}
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
                      <button
                        rel="noreferrer"
                        className={`btn btn-${blog.approvalStatus === "submit"
                          ? "success"
                          : blog.approvalStatus === "pending"
                            ? "warning"
                            : blog.approvalStatus === "Rejected"
                              ? "danger"
                              : "primary"
                          } btn-sm mx-1`}
                      >
                        {" "}
                        {approval}
                        {approval2}
                      </button>
                    )}
                    {user && user.isadmin && approval === "Approved" && (
                      <>
                        <button
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#publicOrPrivate"
                          className={`btn btn-${blog.public ? "warning" : "success"
                            } btn-sm mx-1 ${blog.approvalStatus === "Rejected" ? "disabled" : ""
                            }`}
                        >
                          {" "}
                          {pub}
                          {pub2}
                        </button>
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
                                  {`Are you sure to make blog "${blog.title}" ${!blog.public ? "Public" : "Private"
                                    }?`}
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

              </div>
              <div className="blog-subCategory">
                <div key={0}>
                  tags:
                </div>
                {blog.tags.map((tag, i) => (
                  <div key={i}>
                    <Tag label={tag} />
                    {/* {tag} */}
                  </div>
                ))}
              </div>
              <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
            </div>
            <div className="col-lg-4">
              <ProfileCard a={authordetails} />
            </div>
          </div>
        </div>
      ) : (
        <EmptyList />
      )}
    </>
  );
};

export default BlogDisplay;
