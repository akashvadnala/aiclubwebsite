import React from "react";
import { NavLink } from "react-router-dom";
import './Publications.css';

function PublicationSpace(props) {
  return (
    <div className="publicationSpace card">
      <div className="card-body text-center p-2">
        <h5 className="card-title mb-1">
          <strong>{props.publication.title}</strong>
        </h5>
        <h6 className="card-text mb-1">{props.publication.coAuthors.join(", ")}</h6>
        <h6 className="card-text text-success mb-1">
          <strong>{"Publisher : " + props.publication.publisher}</strong>
        </h6>
        <NavLink
          to={"/projects/" + props.publication.url}
          className="btn btn-sm btn-primary mt-1"
        >
          View Project
        </NavLink>
        <button className="btn btn-sm btn-danger mx-2 mt-1">
          <a
            href={props.publication.researchPaperLink}
            target="_blank"
            style={{ color: "white" }}
          >
            View Research Paper  <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
          </a>
        </button>
      </div>
    </div>
  );
}

export default PublicationSpace;
