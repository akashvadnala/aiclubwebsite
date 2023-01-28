import React from "react";
import { NavLink } from "react-router-dom";

function PublicationCard(props) {
  return (
    <div className="publication-card card">
      <div className="card-body text-center">
        <h5 className="card-title">
          <strong>{props.publication.title}</strong>
        </h5>
        <h6 className="card-text">{props.publication.coAuthors.join(", ")}</h6>
        <h6 className="card-text text-success">
          <strong>{"Publisher : " + props.publication.publisher}</strong>
        </h6>
        <NavLink
          to={"/projects/" + props.publication.url}
          className="btn btn-primary"
        >
          View Project
        </NavLink>
        <button className="btn btn-danger mx-2">
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

export default PublicationCard;
