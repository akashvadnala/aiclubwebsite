import axios from "axios";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import TextTruncate from "react-text-truncate";
import { alertContext } from "../../Context/Alert";

function TeamCard({ team, isadmin, isdelete }) {
  const { showAlert } = useContext(alertContext);
  const PostDelete = async (username, id) => {
    try {
      const confirmed = window.confirm(
        `Are you sure to delete the user ${username}?`
      );
      if (confirmed) {
        await axios.delete(`${SERVER_URL}/team/delete/${id}`, { withCredentials: true });
        window.location.reload(true);
        showAlert("User deleted successfully!", "success");
      }
    } catch (err) {
      showAlert(err.response.data.error, "danger");
    }
  };
  return (
    <div className="team-card-container col-lg-3 col-md-4 col-sm-6 col-6">

      <div className="card mt-0 mb-4 mx-2">
        <div className="card-img">
          <img src={team.photo} alt={team.firstname} />
        </div>
        <div className="card-body px-3 pb-3">
          <NavLink rel="noreferrer" to={`/profile/${team.username}`}>
            <h5 className="text-dark">
              {team.firstname} {team.lastname} &nbsp;
              
              <i class="fa-xs fas fa-external-link-alt"></i>
            </h5>
          </NavLink>
          <h6 className="text-secondary">{team.position}</h6>
          <h6 className="text-secondary">{team.profession}</h6>
          {/* <TextTruncate
            title={team.description}
            line={2}
            element="p"
            truncateText=""
            text={team.description}
            textTruncateChild="..."
          /> */}

          <div className="d-flex justify-content-evenly pt-3">
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
              target="_blank"
            >
              <i
                className="fab fa-linkedin-in fa-lg mx-2"
                style={{ color: "#3b5998" }}
              ></i>
            </a>
            <a
              href={team.github}
              target="_blank"
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
                    <button
                      type="button"
                      rel="noreferrer"
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        PostDelete(team.username, team._id);
                      }}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
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
