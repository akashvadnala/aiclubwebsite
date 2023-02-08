import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import TextTruncate from "react-text-truncate";

function TeamCard({ team, isadmin, isdelete }) {

  const PostDelete = async (username,id) => {
    const confirmed = window.confirm(
      `Are you sure to delete the user ${username}?`
    );
    if (confirmed) {
      const res = await axios.post(`${SERVER_URL}/team/delete/${id}`);
      if (res.status === 200) {
        console.log("User not deleted");
      } else if (res.status === 201) {
        // navigate('/team');
        window.location.reload(true);
      }
    }
  };
  return (
    <div className="team-card-container col-lg-3 col-md-4 col-sm-6 col-6">
      <div className="card" style={{'border':"solid"}}>
        <div className="card-img">
          <img className="card-img-top" src={team.photo} alt={team.firstname} />
        </div>
        <div className="card-body">
          <h5>{team.firstname} {team.lastname}</h5>
          <h6>{team.position}</h6>
          <h6>{team.profession}</h6>
          <TextTruncate
            title={team.description}
            line={2}
            element="p"
            truncateText=""
            text={team.description}
            textTruncateChild="..."
          />
          <div className="d-flex justify-content-evenly">
            <a
              href={`mailto:${team.email}`}
            >
              <i
                className="fas fa-envelope fa-lg mx-2"
                style={{ color: "#55acee" }}
              ></i>
            </a>
            <a
              href={team.linkedin}
            >
              <i
                className="fab fa-linkedin-in fa-lg mx-2"
                style={{ color: "#3b5998" }}
              ></i>
            </a>
            <a
              href={team.github}
            >
              <i
                className="fab fa-github fa-lg mx-2"
                style={{ color: "#333333" }}
              ></i>
            </a>
          </div>
          {isadmin ? (
            <div className="admin-opt d-flex justify-content-evenly pt-3">
              <span>
                <NavLink type="button" to={`/team/edit/${team.username}`} className="btn btn-sm btn-primary"><i className="fas fa-edit"></i> Edit</NavLink>
              </span>
              {isdelete ? null : (
                <>
                  <span>
                    <NavLink
                      type="button"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        PostDelete(team.username,team._id);
                      }}
                    >
                     <i className="fas fa-trash-alt"></i> Delete
                    </NavLink>
                  </span>
                </>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
