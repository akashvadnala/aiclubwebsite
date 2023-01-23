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
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const BlogDisplay = () => {
  const params = new useParams();
  const url = params.url;
  const { user } = useContext(Context);
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
      const res = await axios.get(`${SERVER_URL}/getBlog/${url}`);
      console.log("blog", res.status);
      if (res.status === 200) {
        console.log("blog", res.data.blog);
        const post_ = res.data.blog;
        setBlog(res.data.blog);
        setauthordetails(res.data.author);
        setApproval(res.data.blog.approvalStatus);
        setPub(`${!res.data.blog.public ? "Make Public" : "Make Private"}`);
        setLoad(1);
        if (user && post_.authorName.indexOf(user.username) > -1) {
          setedit(true);
        } else {
          setedit(false);
        }
      } else {
        setLoad(-1);
        setedit(false);
        console.log("No Blog Found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlog();
  }, [user]);

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

  const TogglePublic = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      `Are you sure to make blog "${blog.title}" ${
        !blog.public ? "Public" : "Private"
      }?`
    );
    if (confirmed) {
      setPub(`${!blog.public ? "Publishing" : "Making Private"}`);
      setPub2(<i className="fa fa-spinner fa-spin"></i>);
      const res = await axios.put(
        `${SERVER_URL}/updateblogPublicStatus/${blog.url}`,
        { public: !blog.public ? true : false },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        blog.public = !blog.public ? true : false;
        setPub(`${!blog.public ? "Make Public" : "Make Private"}`);
        setPub2();
        navigate(`/blogs/${blog.url}`);
      } else {
        console.log("Publishing failed");
      }
    }
  };

  const deleteBlog = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      `Are you sure to delete the blog "${blog.title}"?`
    );
    if (confirmed) {
      const res = await axios.post(`${SERVER_URL}/deleteBlog/${blog.url}`);
      if (res.status === 200) {
        navigate("/blogs");
      } else {
        console.log("Blog Cannot be deleted");
      }
    }
  };

  const ChangeApprovalStatus = async (e) => {
    e.preventDefault();
    if (blog.approvalStatus === "submit") {
      const confirmed = window.confirm(
        `Are you sure to submit blog "${blog.title}" for Admin Approval ?`
      );
      if (confirmed) {
        setApproval("pending");
        setApproval2(<i className="fa fa-spinner fa-spin"></i>);
        const res = await axios.put(
          `${SERVER_URL}/updateblogApprovalStatus/${blog.url}`,
          { approvalStatus: "pending" },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.status === 200) {
          setBlog({ ...blog, ["approvalStatus"]: "pending" });
          setApproval2();
          navigate(`/blogs/${blog.url}`);
        } else {
          console.log("Publishing failed");
        }
      }
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
      `${SERVER_URL}/updateblogApprovalStatus/${blog.url}`,
      { approvalStatus: response, public: status },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.status === 200) {
      setBlog({ ...blog, ["approvalStatus"]: response, ["public"]: status });
      setApproval2();
      navigate(`/blogs/${blog.url}`);
    } else {
      console.log("Publishing failed");
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
                {(edit || user.isadmin) && (
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
                      <NavLink
                        rel="noreferrer"
                        onClick={deleteBlog}
                        className="btn btn-danger btn-sm mx-1"
                      >
                        {" "}
                        Delete
                      </NavLink>
                    )}
                    {user.isadmin && approval === "pending" ? (
                      <>
                        <NavLink
                          rel="noreferrer"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          className={`btn btn-${
                          blog.approvalStatus==="submit" ? "success" : blog.approvalStatus==="pending"?"warning":blog.approvalStatus==="Rejected"?"danger":"primary"
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
                    ) : (
                      <NavLink
                        rel="noreferrer"
                        onClick={ChangeApprovalStatus}
                        className={`btn btn-${
                          blog.approvalStatus === "submit"
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
                      </NavLink>
                    )}
                    {user.isadmin && (
                      <NavLink
                        rel="noreferrer"
                        onClick={TogglePublic}
                        className={`btn btn-${
                          blog.public ? "warning" : "success"
                        } btn-sm mx-1 ${blog.approvalStatus==="Rejected"?"disabled":""}`}
                      >
                        {" "}
                        {pub}
                        {pub2}
                      </NavLink>
                    )}
                  </div>
                )}
                <div className="blog-subCategory">
                  {blog.tags.map((tag, i) => (
                    <div key={i}>
                      <Tag label={tag} />
                    </div>
                  ))}
                </div>
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
