import React from "react";
import {NavLink} from "react-router-dom";

function PublicationCard(props) {
  
  return (
    <div className="publication-card card">
      <div className="card-header">Research Paper</div>
      <div className="card-body">
        <h5 className="card-title"><strong>{props.publication.title}</strong></h5>
        <h6 className="card-text">{props.publication.coAuthors.join(", ")}</h6>
        <h6 className="card-text"><strong>{"Publisher : " + props.publication.publisher}</strong></h6>
        <NavLink to={"/projects/" + props.publication.url} className="btn btn-primary">
          View Project
        </NavLink>
        <a href={props.publication.researchPaperLink} className="btn btn-primary mx-2">
          View Research Paper
        </a>
      </div>
    </div>
  );
}

export default PublicationCard;
