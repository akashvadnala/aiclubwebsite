import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./BlogCard.css";

const Blogitem = ({blog}) => {
  const d = new Date(blog.createdAt);
  const ddmmyy = d.getDate() + "/" + String(parseInt(d.getMonth()) + 1) + "/" + d.getFullYear();

  const addDefaultSrc = (ev) => {
    ev.target.src =
      "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg";
  };

  const [names,setNames] = useState("");
  const getFirstLastNameForBlogs = async () => {
      axios.get(`${SERVER_URL}/blogs/getFirstLastNameForBlogs/${blog.url}`)
      .then(data=>{
          setNames(data.data);
      });
  }
  useEffect(()=>{
    if(blog){
      getFirstLastNameForBlogs();
    }
  },[blog]);

  return (
    <div className="my-3 blogcard-container">
      <div className="card text-center">
        <img
          onError={addDefaultSrc}
          src={
            !blog.cover
              ? "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg"
              : blog.cover
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
