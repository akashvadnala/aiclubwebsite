import React from "react";
import "./Publications.css";
import PublicationCard from "./PublicationCard";

const Publications = ({ publications }) => {
  return (
    <>
      <div className="publications-container adjust">
        <div className="row">
          <h3 className="text-center py-3">Publications</h3>
          <div
            id="carouselExampleControls"
            className="carousel"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {publications.map((publication) => {
                return (
                  <div class="carousel-item active">
                    <PublicationCard publication={publication} />
                  </div>
                );
              })}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Publications;
