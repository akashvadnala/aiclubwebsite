import React, { useRef, useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import Error from "../Error";
import { useNavigate } from "react-router-dom";
import "./BlogDisplay.css";
import JoditEditor from "jodit-react";
import ProfileCard from "./profile/ProfileCard";
import Tag from "./tags/Tag";
import axios from "axios";
import Loading from "../Loading";
import { SERVER_URL } from "../../EditableStuff/Config";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { editorPreviewConfig } from "../Params/editorConfig";

const BlogDisplay = () => {
  const params = new useParams();
  const editor = useRef(null);
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
  const navigate = useNavigate();

  const getBlog = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/blogs/getBlog/${url}`);
      const post_ = res.data.blog;
      setBlog(res.data.blog);
      setauthordetails(res.data.author);
      setApproval(res.data.blog.approvalStatus);
      setPub(`${!res.data.blog.public ? "Make Public" : "Make Private"}`);
      if (!post_.public) {
        if (user.isadmin || user._id === post_.authorName) {
          setLoad(1);
        }
        else {
          setLoad(-1);
        }
      }
      else {
        setLoad(1);
      }
      if (user && post_.authorName === user._id) {
        setedit(true);
      } else {
        setedit(false);
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
    if (logged_in !== 0 && url) {
      getBlog();
    }
  }, [logged_in, url]);

  const addDefaultSrc = (ev) => {
    ev.target.src =
      "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg";
  };

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
        blog.public = !blog.public;
        blog.approvalStatus = "Pending";
        await axios.put(
          `${SERVER_URL}/blogs/updateblogPublicStatus/${blog.url}`,
          { 
            public: blog.public,
            approvalStatus:blog.approvalStatus
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
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
        const confirmed = window.confirm(
          `Are you sure to delete the blog ${blog.title}?`
        );
        if (confirmed) {
          await axios.delete(`${SERVER_URL}/imgdelete`,
            { url: blog.cover },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          const res = await axios.delete(`${SERVER_URL}/blogs/deleteBlog/${blog._id}`, { withCredentials: true });
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
      if (blog.approvalStatus === "Draft") {
        if (status) {
          setApproval("Pending");
          const res = await axios.put(
            `${SERVER_URL}/blogs/updateblogApprovalStatus/${blog.url}`,
            { approvalStatus: "Pending" },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          showAlert("Submitted for Admin approval", "success");
          setBlog({ ...blog, approvalStatus: "Pending" });
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
      const res = await axios.put(
        `${SERVER_URL}/blogs/updateblogApprovalStatus/${blog.url}`,
        { approvalStatus: response, public: status },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      showAlert(`${response === "Approved" ? "Approved & Published." : response}.`, "success");
      setBlog({ ...blog, approvalStatus: response, public: status });
      navigate(`/blogs/${blog.url}`);
    } catch (error) {
      showAlert(`${error.response.data.error}`, "danger");
    }
  };
  console.log('blog', blog);
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <>
          <div className="container blogdisplay-container pt-3">
            <div className="row pt-5">
              <Helmet>
                <title>Blogs - AI Club</title>
              </Helmet>
              <div className="col-lg-8 px-5">
                <div className="header align-center d-flex justify-content-between mb-2">
                  <div>
                    <div className="d-flex align-items-center">
                      <div className="text-header">{blog.title}</div>
                      {(edit || (user && user.isadmin)) && <div className="ml-2 px-2 rounded border text-secondary">{blog.approvalStatus}</div>}
                    </div>
                    <p className="blog-date">
                      Published on {returnDDMMYYYY(blog.createdAt)}
                    </p>
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
                                <NavLink to={`/blogs/${blog.url}/edit`} className="dropdown-item" >Edit</NavLink>
                                <hr />
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#delete" className="dropdown-item" >Delete</button>
                              </>
                            )}
                            {user && user.isadmin && blog.approvalStatus === "Pending" && (
                              <>
                              <hr />
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#approveOrReject" className="dropdown-item">
                                  Approve/Reject
                                </button>
                              </>
                            )}
                            {edit && blog.approvalStatus === "Draft" && (
                              <>
                              <hr />
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#submitForApproval" className="dropdown-item">
                                  Submit
                                </button>
                              </>
                            ) }
                            {user && user.isadmin && blog.approvalStatus === "Approved" && (
                              <>
                              <hr />
                                <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#publicOrPrivate" className="dropdown-item">
                                  Make {blog.public?"Private":"Public"} 
                                </button>
                              </>
                            )}
                          </>
                        </div>
                      </div>
                    </div>

                  )}
                </div>
                <div>
                  {/* {(edit || (user && user.isadmin)) && (
                    <>
                      {edit && (
                        <NavLink to={`/blogs/${blog.url}/edit`} className="dropdown-item" >Edit</NavLink>
                      )}
                      {edit && (
                        <>
                          <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#delete" className="dropdown-item" >Delete</button>
                        </>
                      )}
                      {user && user.isadmin && approval === "Pending" ? (
                        <>
                          <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#approveOrReject"
                            className={`btn btn-${blog.approvalStatus === "submit"
                              ? "success"
                              : blog.approvalStatus === "Pending"
                                ? "warning"
                                : blog.approvalStatus === "Rejected"
                                  ? "danger"
                                  : "primary"
                              } btn-sm mx-1`}
                          >
                            {"Approve/Reject"}
                          </button>
                        </>
                      ) : blog.approvalStatus === "submit" ? (
                        <>
                          <button
                            rel="noreferrer"
                            data-bs-toggle="modal"
                            data-bs-target="#submitForApproval"
                            className={`btn btn-${blog.approvalStatus === "submit"
                              ? "success"
                              : blog.approvalStatus === "Pending"
                                ? "warning"
                                : blog.approvalStatus === "Rejected"
                                  ? "danger"
                                  : "primary"
                              } btn-sm mx-1`}
                          >
                            {" "}
                            {approval}
                          </button>
                        </>
                      ) : (
                        <button
                          rel="noreferrer"
                          className={`btn btn-${blog.approvalStatus === "submit"
                            ? "success"
                            : blog.approvalStatus === "Pending"
                              ? "warning"
                              : blog.approvalStatus === "Rejected"
                                ? "danger"
                                : "primary"
                            } btn-sm mx-1`}
                        >
                          {" "}
                          {approval}
                        </button>
                      )}
                      {user && user.isadmin && approval === "Approved" && (
                        <>
                          <button rel="noreferrer" data-bs-toggle="modal" data-bs-target="#publicOrPrivate"
                            className={`btn btn-${blog.public ? "warning" : "success"
                              } btn-sm mx-1 ${blog.approvalStatus === "Rejected" ? "disabled" : ""
                              }`}>
                            {pub}
                            {pub2}
                          </button>
                        </>
                      )}
                    </>
                  )} */}

                </div>
                <JoditEditor
                  name="content"
                  className="mt-4"
                  ref={editor}
                  value={blog ? blog.content : ""}
                  config={editorPreviewConfig}
                />
                <div className="blog-subCategory mt-3">
                  <div key={0}>tags:</div>
                  {blog.tags.map((tag, i) => (<div key={i}> <Tag label={tag} /> </div>))}
                </div>
              </div>
              <div className="col-lg-4 mt-1">
                <ProfileCard a={authordetails} />
                <div className="my-4">
                  <div className="my-3"><p>Related Blogs</p></div>
                  <div className="d-flex py-2">
                    <div className="">
                      <img
                        onError={addDefaultSrc}
                        src={
                          !blog.cover
                            ? "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg"
                            : blog.cover
                        }
                        alt="blog"
                        style={{ width: "4rem", height: "4rem" }}
                      />
                    </div>
                    <div className="px-2">
                      <NavLink className="a-hover-underline" to={`/blogs/${blog.url}`}><h5>{blog.title}</h5></NavLink>
                      <p className="text-secondary">{blog.authorName}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex py-2">
                    <div className="">
                      <img
                        onError={addDefaultSrc}
                        src={
                          !blog.cover
                            ? "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg"
                            : blog.cover
                        }
                        alt="blog"
                        style={{ width: "4rem", height: "4rem" }}
                      />
                    </div>
                    <div className="px-2">
                      <NavLink className="a-hover-underline" to={`/blogs/${blog.url}`}><h5>{blog.title}</h5></NavLink>
                      <p className="text-secondary">{blog.authorName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete blog */}
          <div className="modal fade" id="delete" tabIndex="-1" aria-labelledby="deleteLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title fs-5" id="deleteLabel">
                    Are you sure to delete the blog {blog.title}?
                  </h6>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-danger btn-sm" data-bs-dismiss="modal" onClick={() => { deleteBlog(true); }}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
          {/* Approve or reject */}
          <div className="modal fade" id="approveOrReject" tabIndex="-1" aria-labelledby="approveOrRejectLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title fs-5" id="approveOrRejectLabel" >
                    Approve or Reject
                  </h6>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm" data-bs-dismiss="modal" >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" data-bs-dismiss="modal" onClick={() => { ApproveOrReject(true); }} >
                    Approve & Publish
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" data-bs-dismiss="modal" onClick={() => { ApproveOrReject(false); }} >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit for approval */}

          <div className="modal fade" id="submitForApproval" tabIndex="-1" aria-labelledby="submitForApprovalLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title fs-5" id="submitForApprovalLabel" >
                    Are you sure to submit blog "{blog.title}" for Admin Approval ?
                  </h6>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success btn-sm" data-bs-dismiss="modal" onClick={() => { ChangeApprovalStatus(true); }} >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Public Private Label */}
          <div
            className="modal fade" id="publicOrPrivate" tabIndex="-1" aria-labelledby="publicOrPrivateLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title fs-5" id="publicOrPrivateLabel" >
                    {`Are you sure to make blog "${blog.title}" ${!blog.public ? "Public" : "Private"}?`}
                  </h6>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm" data-bs-dismiss="modal" >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success btn-sm" data-bs-dismiss="modal" onClick={() => { TogglePublic(true); }} >
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

export default BlogDisplay;
