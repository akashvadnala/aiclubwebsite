import React, { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./BlogCard.css";
import { alertContext } from "../../../Context/Alert";

const Blogitem = ({ blog }) => {
  const { showAlert } = useContext(alertContext);
  const navigate = useNavigate();
  const d = new Date(blog.createdAt);
  const ddmmyy = d.getDate() + "/" + String(parseInt(d.getMonth()) + 1) + "/" + d.getFullYear();

  const addDefaultSrc = (ev) => {
    ev.target.src =
      "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg";
  };

  
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    // blog.cover may be either:
    // - an absolute URL string returned by /imgupload (e.g. http://.../getimg/<id>)
    // - a raw image id stored in DB (e.g. <id>)
    // Handle both: if it's an absolute URL, use it directly; otherwise build the server getimg URL.
    try {
      if (!blog || !blog.cover) {
        setImageSrc(null);
        return;
      }
      console.log("blogcover:", blog.cover);
      if (typeof blog.cover === 'string' && (blog.cover.startsWith('http://') || blog.cover.startsWith('https://'))) {
        setImageSrc(blog.cover);
      } else {
        // treat as id
        setImageSrc(`${SERVER_URL.replace(/\/$/, '')}/getimg/${blog.cover}`);
      }
    } catch (error) {
      console.error('Error preparing image src:', error);
    }
  }, [blog]);

  const [names, setNames] = useState("");
  const getFirstLastNameForBlogs = async () => {
    axios.get(`${SERVER_URL}/blogs/getFirstLastNameForBlogs/${blog.url}`)
      .then(data => {
        setNames(data.data);
      }).catch(err => {
        navigate('/blogs');
        showAlert(err.response.data.error, "danger");
      });
  }
  useEffect(() => {
    if (blog) {
      getFirstLastNameForBlogs();
    }
  }, [blog]);

  return (
    <div className="my-3 blogcard-container">
      <div className="card text-center">
        <img
          // onError={addDefaultSrc}
          src={
            imageSrc
          }
          alt="blog"
          className="card-img-top"
        />
        <div className="card-body">
          <h5 className="card-title">{blog.title} </h5>
          <p className="card-text">
            <small className="text-muted">
              By {names}
              <br />
              on {ddmmyy}
            </small>
          </p>
          <NavLink
            rel="noreferrer"
            to={`/blogs/${blog.url}`}
            className="btn btn-sm btn-dark"
          >
            Read More
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default Blogitem;
