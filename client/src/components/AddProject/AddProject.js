import React, { useContext, useEffect, useState } from "react";
import "./AddProject.css";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { useNavigate } from "react-router-dom";
import { CLIENT_URL, SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";
import Error from "../Error";
import Loading from "../Loading";
import { Helmet } from "react-helmet";

const AddProject = () => {
  const navigate = useNavigate();
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [add, setAdd] = useState(false);
  const [xauthor, setXAuthor] = useState("");
  const [load, setLoad] = useState(0);
  let project = {
    title: "",
    url: "",
    creator: user ? user._id : null,
    authors: [user ? user._id : null],
    content: "",
    cover: "",
  };
  const [proj, setProj] = useState({});
  const [teams, setTeams] = useState([]);
  const [projTeams, setProjTeams] = useState([]);
  let team = [];
  let projTeam = [];
  let teamArray = [];
  const getTeams = () => {
    try {
      axios.get(`${SERVER_URL}/getTeams`).then(async (data) => {
        teamArray = data.data;
        team = teamArray.filter((t) => t.id !== user._id);
        projTeam = teamArray.filter((t) => t.id === user._id);
        setTeams(team);
        setProjTeams(projTeam);
        setProj(project);
        setLoad(1);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (logged_in === 1) {
      getTeams();
    }
    else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in]);

  const handlePhoto = (e) => {
    setProj({ ...proj, ["cover"]: e.target.files[0] });
  };

  const handleInputs = (e) => {
    setProj({ ...proj, [e.target.name]: e.target.value });
  };
  const removeXAuthor = (author) => {
    let current = projTeams.filter(t => t.id === author);
    projTeam = projTeams.filter(t => t.id !== author);
    team = teams;
    team.push(current[0]);
    setTeams(team);
    setProjTeams(projTeam);
    let authors = proj.authors.filter(a => a !== author);
    setProj({ ...proj, ["authors"]: authors });
    setXAuthor("");
  };
  const AddXAuthor = () => {
    if (xauthor !== "") {
      let current = teams.filter((t) => t.id === xauthor);
      team = teams.filter((t) => t.id !== xauthor);
      projTeam = projTeams;
      projTeam.push(current[0]);
      setTeams(team);
      setProjTeams(projTeam);
      let authors = proj.authors;
      authors.push(xauthor);
      setProj({ ...proj, ["authors"]: authors });
      setXAuthor("");
    }
  };
  const PostProject = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${SERVER_URL}/isProjectUrlExist/${proj.url}`);
      setAdd(true);
      const data = new FormData();
      data.append("photo", proj.cover);
      const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
      proj.cover = img.data;
      const projdata = await axios.post(`${SERVER_URL}/projectAdd`, proj, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      showAlert("Project Created Successfully!", "success");
      navigate(`/projects/${proj.url}/edit`);
    }
    catch (err) {
      console.log(err);
      showAlert(err.response.data.error,"danger");
    }
  };
  
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 && user ? (
        <div className="container addproject-container text-center">
          <Helmet>
            <title>Project - AI Club</title>
          </Helmet>
          <div className="adjust">
            <h3>Add Project</h3>
            <form
              method="POST"
              onSubmit={PostProject}
              encType="multipart/form-data"
            >
              <div className="form-group my-3 row">
                <label for="title" className="col-sm-2 text-end">
                  Project Title :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="title"
                    value={proj.title}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Enter Project Title"
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="url" className="col-sm-2 text-end">
                  Project Url :
                </label>
                <div className="col-sm-10">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text text-end"
                        id="basic-addon3"
                      >
                        {CLIENT_URL}/projects/
                      </span>
                    </div>
                    <input
                      type="text"
                      name="url"
                      value={proj.url}
                      onChange={handleInputs}
                      className="form-control"
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Enter Project Url"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="url" className="col-sm-2 text-end">
                  Authors :
                </label>
                <div className="col-sm-10">
                  {projTeams.map((t, i) => {
                    return (
                      <div className="form-group my-2 row" key={i}>
                        <div className="col col-9">
                          <input
                            type="text"
                            value={t.name}
                            className="form-control"
                            id="author"
                            aria-describedby="title"
                            disabled
                          />
                        </div>
                        <div className="col col-3">
                          {user._id !== t.id && (
                            <input
                              type="reset"
                              className="btn btn-danger"
                              onClick={() => removeXAuthor(t.id)}
                              value="Remove"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="form-group my-2 row">
                    <div className="col col-9">
                      <select
                        name="xauthor"
                        value={xauthor}
                        onChange={(e) => setXAuthor(e.target.value)}
                        className="form-select"
                        aria-label="authors"
                      >
                        <option value="">Select Author</option>
                        {teams.map((t) => {
                          return <option value={t.id}>{t.name}</option>;
                        })}
                      </select>
                    </div>
                    <div className="col col-3">
                      <button
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXAuthor}
                      >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-plus-circle-fill"
                        viewBox="0 0 16 18"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg>{" "}
                      Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Project Cover Photo :
                </label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handlePhoto}
                    className="form-control"
                    id="photo"
                    aria-describedby="photo"
                    required
                  />
                </div>
              </div>
              {
                add ?
                  <button type="submit" name="submit" className="btn btn-primary" disabled>
                    Creating <i className="fa fa-spinner fa-spin"></i>
                  </button>
                  :
                  <button type="submit" name="submit" className="btn btn-primary">
                    Create
                  </button>
              }

            </form>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default AddProject;
