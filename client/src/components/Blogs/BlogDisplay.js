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
  const navigate = useNavigate();

  const getBlog = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/getBlog/${url}`);
      console.log("blog", res.status);
      if (res.status === 200) {
        console.log("blog", res.data);
        const post_ = res.data.blog;
        setBlog(res.data.blog);
        setauthordetails(res.data.author);
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

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container projectdisplay-container py-5">
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
                {edit && (
                  <div className="text-center fs-6 p-2">
                    <NavLink
                      to={`/blogs/${blog.url}/edit`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit{" "}
                    </NavLink>
                    ·
                    <NavLink
                      rel="noreferrer"
                      onClick={deleteBlog}
                      className="btn btn-danger btn-sm"
                    >
                      {" "}
                      Delete
                    </NavLink>
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
            <div className="col-lg-4" >
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
