import React from "react";
import "./ProfileCard.css";

const ProfileCard = (props) => {
  return (
    <div className="ProfileCard">
      <div className="container mb-4 d-flex justify-content-center">
        <div className="card p-4">
          <div className=" image d-flex flex-column justify-content-center align-items-center">
            <button className="btn">
              <img
                className="rounded-circle"
                alt={props.a.firstname}
                src={props.a.photo}
                height="120"
                width="120"
              />
            </button>
            <div className="name mt-2">{props.a.firstname} {props.a.lastname}</div>
            <div className="text mt-1">{props.a.position}</div>
            <div className="text mt-1">{props.a.profession}</div>
            <div className="p-2 rounded date mt-3">
              <div className="d-flex justify-content-evenly">
                <a href={`mailto:${props.a.email}`}>
                  <i
                    className="fas fa-envelope fa-lg mx-4"
                    style={{ color: "#55acee" }}
                  ></i>
                </a>
                <a href={props.a.linkedin} target="_blank">
                  <i
                    className="fab fa-linkedin-in fa-lg mx-4"
                    style={{ color: "#3b5998" }}
                  ></i>
                </a>
                <a href={props.a.github} target="_blank">
                  <i
                    className="fab fa-github fa-lg mx-4"
                    style={{ color: "#333333" }}
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
