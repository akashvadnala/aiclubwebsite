import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../EditableStuff/Config";
import Loading from "../../Loading";
import Error from "../../Error";
import "./Publications.css";
import PublicationCard from "./PublicationCard";

const Publications = () => {
  const [publications, setPublicationList] = useState([]);
  const [load, setLoad] = useState(0);

  const getPublicationsData = async () => {
    try {
      axios.get(`${SERVER_URL}/getResearchPapers`).then((data) => {
        if (data.status === 200) {
          console.log("data", data.data);
          setPublicationList(data.data);
          setLoad(1);
        } else {
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPublicationsData();
  }, []);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
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
      ) : (
        <Error />
      )}
    </>
  );
};

export default Publications;
