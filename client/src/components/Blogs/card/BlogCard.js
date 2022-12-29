import React from "react";
import { NavLink } from "react-router-dom";
import "./BlogCard.css";

const Blogitem = (props) => {
  const d = new Date(props.blog.createdAt);
  const ddmmyy = d.getDate() + "/" + String(parseInt(d.getMonth()) + 1) + "/" + d.getFullYear();

  const addDefaultSrc = (ev) => {
    ev.target.src =
      "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg";
  };
  return (
    <div className="my-3 blogcard-container">
      <div className="card">
        <img
          onError={addDefaultSrc}
          src={
            !props.blog.cover
              ? "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg"
              : props.blog.cover
          }
          alt="blog"
          className="card-img-top"
        />
        <div className="card-body">
          <h5 className="card-title">{props.blog.title} </h5>
          <p className="card-text">
            <small className="text-muted">
              By {!props.blog.authorName ? "Unknown" : props.blog.authorName} on{" "}
              {ddmmyy}
            </small>
          </p>
          <NavLink
            rel="noreferrer"
            to={`/blogs/${props.blog.url}`}
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
