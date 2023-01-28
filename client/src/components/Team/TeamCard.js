import axios from "axios";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import TextTruncate from "react-text-truncate";

function TeamCard({ team, isadmin, isdelete }) {

  const PostDelete = async (username) => {
    const confirmed = window.confirm(
      `Are you sure to delete the user ${username}?`
    );
    if (confirmed) {
      const res = await axios.post(`${SERVER_URL}/team/delete/${username}`);
      if (res.status === 200) {
        console.log("User not deleted");
      } else if (res.status === 201) {
        // navigate('/team');
        window.location.reload(true);
      }
    }
  };
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-6">
      <div className="card" style={{'border':"solid"}}>
        <img className="card-img-top" src={team.photo} alt={team.firstname} />
        <div className="card-body">
          <h5>
            {team.firstname} {team.lastname}
          </h5>
          <h7>{team.profession}</h7>
          <TextTruncate
            title={team.description}
            line={2}
            element="p"
            truncateText=""
            text={team.description}
            textTruncateChild="..."
          />
          <div className="d-flex justify-content-evenly my-4">
            <a
              className="fas fa-envelope fa-lg mx-2"
              style={{ color: "#55acee" }}
              href={`mailto:${team.email}`}
            ></a>
            <i
              className="fab fa-linkedin-in fa-lg mx-2"
              style={{ color: "#3b5998" }}
            ></i>
            <i
              className="fab fa-github fa-lg mx-2"
              style={{ color: "#333333" }}
            ></i>
          </div>
          {isadmin ? (
            <div className="admin-opt d-flex justify-content-evenly">
              <span>
                <NavLink to={`/team/edit/${team.username}`}>Edit <i className="fas fa-edit"></i></NavLink>
              </span>
              {isdelete ? null : (
                <>
                  <span>
                    <NavLink
                      type="button"
                      style={{ color: "#bc1616" }}
                      onClick={() => {
                        PostDelete(team.username);
                      }}
                    >
                      &nbsp;&nbsp;&nbsp; Delete <i className="fas fa-trash-alt"></i>
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
