import React from "react";
import "./Publications.css";
import PublicationCard from "./PublicationCard";
import Carousel from 'react-bootstrap/Carousel';

const Publications = ({ publications }) => {
  return (
    <>



      <div className="publications-container py-5 adjust">
        <div className="row">
          <h3 className="text-center pb-3">Publications</h3>
          <Carousel>
        {
          publications.map((publication)=>{
            return(
              <Carousel.Item interval={5000}>
                <PublicationCard publication={publication} />
              </Carousel.Item>
              
            )
          })
        }
      </Carousel>
          {/* <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              {publications.map((publication, i) => {
                return (
                  <div className={`carousel-item ${i === 0 ? "active" : ""}`}>
                    <PublicationCard publication={publication} />
                  </div>
                );
              })}

            </div>
            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div> */}
          {/* <div
            id="carouselExampleControls"
            className="carousel"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {publications.map((publication, i) => {
                return (
                  <div className={`carousel-item ${i === 0 ? "active" : ""}`}>
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Publications;
