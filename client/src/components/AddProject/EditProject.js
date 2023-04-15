import React, { useRef, useState, useContext, useEffect } from "react";
import "./AddProject.css";
import JoditEditor from "jodit-react";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { NavLink, useParams } from "react-router-dom";
import Error from "../Error";
import axios from "axios";
import { CLIENT_URL, SERVER_URL } from "../../EditableStuff/Config";
import Loading from "../Loading";
import { Helmet } from "react-helmet";
import { editorConfig } from "../Params/editorConfig";

const EditProject = () => {
  const { url } = useParams();
  const editor = useRef(null);
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [add, setAdd] = useState(false);
  const [xauthor, setXAuthor] = useState("");
  const [xtag, setXTag] = useState("");
  const [xCoAuthor, setXCoAuthor] = useState("");
  const [Img, setImg] = useState();
  const [photo, setPhoto] = useState(null);
  const [proj, setProj] = useState();
  const [load, setLoad] = useState(0);
  const [preview, setPreview] = useState(false);
  const [teams, setTeams] = useState([]);
  const [projTeams, setProjTeams] = useState([]);
  let team = [];
  let projTeam = [];
  let teamArray = [];
  let project = null;
  const getProject = async () => {
    try {
      team = [];
      teamArray = [];
      let projTeam = [];
      await axios.get(`${SERVER_URL}/getTeams`).then((data) => {
        teamArray = data.data;
        team = teamArray;
      });
      await axios
        .get(`${SERVER_URL}/getProjectEdit/${url}`)
        .then(async (data) => {
          project = data.data;
          if (user && project.authors.indexOf(user._id) > -1) {
            await Promise.all(
              project.authors.map((author) => {
                team = team.filter((t) => t.id !== author);
                projTeam.push(teamArray.filter((t) => t.id == author)[0]);
              })
            );
            setTeams(team);
            setProjTeams(projTeam);
            setProj(project);
            setLoad(1);
          } else {
            setLoad(-1);
          }
        });
    } catch (err) {
      setLoad(-1);
    }
  };

  useEffect(() => {
    if (logged_in === 1) {
      if (url) {
        getProject();
      } else {
        setLoad(-1);
      }
    } else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in, url]);

  const handlePhoto = (e) => {
    setImg(e.target.files[0]);
    setPhoto(URL.createObjectURL(e.target.files[0]));
  };

  const handleValue = (e) => {
    setProj({ ...proj, content: e });
    setPreview(false);
  };

  const handlePublished = () => {
    setProj({ ...proj, isPublished: !proj.isPublished });
    setPreview(false);
  };

  const handleInputs = (e) => {
    setProj({ ...proj, [e.target.name]: e.target.value });
    setPreview(false);
  };

  const handleUrl = (e) => {
    let value = e.target.value;
    let url = "";
    for (let i = 0; i < value.length; i++) {
      const c = value[i];
      if (("a" <= c && c <= "z") || ("A" <= c && c <= "Z") || ("0" <= c && c <= "9") || c === "-" || c === '_') {
        url += c;
      }
      else {
        showAlert("Special Characters are not allowed except '-' and '_'", "danger");
      }
    }
    setProj({ ...proj, url: url });
  }

  const removeXAuthor = (author) => {
    let current = projTeams.filter((t) => t.id === author);
    projTeam = projTeams.filter((t) => t.id !== author);
    team = teams;
    team.push(current[0]);
    setTeams(team);
    setProjTeams(projTeam);
    let authors = proj.authors.filter((a) => a !== author);
    setProj({ ...proj, authors: authors });
    setXAuthor("");
    setPreview(false);
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
      setProj({ ...proj, authors: authors });
      setXAuthor("");
      setPreview(false);
    }
  };
  const removeXTag = (tag) => {
    let current = proj.tags;
    current = current.filter((x) => x !== tag);
    setProj({ ...proj, tags: current });
    setXTag("");
    setPreview(false);
  };
  const AddXTag = () => {
    let s = xtag.trim();
    if (s != "") {
      let current = proj.tags;
      current.push(s);
      setProj({ ...proj, tags: current });
      setXTag("");
      setPreview(false);
    }
  };

  const removeXCoAuthor = (coAuthor) => {
    let current = proj.coAuthors;
    current = current.filter((x) => x !== coAuthor);
    setProj({ ...proj, coAuthors: current });
    setXCoAuthor("");
    setPreview(false);
  };
  const AddXCoAuthor = () => {
    let current = proj.coAuthors;
    current.push(xCoAuthor);
    setProj({ ...proj, coAuthors: current });
    setXCoAuthor("");
    setPreview(false);
  };

  const UpdateProject = async (e) => {
    e.preventDefault();
    try {
      if (url !== proj.url) {
        await axios.get(`${SERVER_URL}/isProjectUrlExist/${proj.url}`);
      }

      setAdd(true);

      if (Img) {
        await axios.put(`${SERVER_URL}/imgdelete`,
          { url: proj.cover },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = new FormData();
        data.append("photo", Img);
        data.append("category","projects");
        const img = await axios.post(`${SERVER_URL}/imgupload`, data, {
          withCredentials: true,
        });
        proj.cover = img.data;
      }

      const projdata = await axios.put(
        `${SERVER_URL}/updateProject/${proj._id}`,
        proj,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setAdd(false);
      showAlert("Saved as Draft!", "success");
      setPreview(true);
    } catch (err) {
      console.log(err);
      showAlert(err.response.data.error, "danger");
    }
  };
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container addproject-container pb-4">
          <Helmet>
            <title>Project - AI Club</title>
          </Helmet>
          <div className="text-center text-header pt-4 pb-1">Edit Project</div>
          <div className="text-center fs-6 pb-4">
            {preview ? (
              <NavLink
                rel="noreferrer"
                to={`/projects/${proj.url}`}
                className="btn btn-success btn-sm"
              >
                Preview
              </NavLink>
            ) : (
              <span className="text-muted">Save for Preview</span>
            )}
          </div>

          <form
            method="POST"
            onSubmit={UpdateProject}
            encType="multipart/form-data"
          >
            <div className="row">
              <div className="col-12 col-md-9">
                <div className="form-group mb-1">
                  <label htmlFor="title">Project Title :</label>
                </div>
                <div className="form-group mb-4">
                  <input
                    type="text"
                    name="title"
                    value={proj ? proj.title : ""}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Enter Project Title"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <div className="form-group mb-1">
                    <label htmlFor="url">Project Url :</label>
                  </div>
                  <div className="">
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
                        onChange={handleUrl}
                        className="form-control"
                        id="basic-url"
                        aria-describedby="basic-addon3"
                        placeholder="Enter Project Url"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group my-1">
                  <label>Project Tags :</label>
                </div>
                <div className="form-group my-2 row">
                  {proj &&
                    proj.tags.map((a, i) => {
                      return (
                        <div
                          className="col-12 col-sm-6 col-lg-4 mb-2 row"
                          key={i}
                        >
                          <div className="col-8 paddr">
                            <input
                              type="text"
                              value={a}
                              className="form-control"
                              id="tag"
                              aria-describedby="tag"
                              disabled
                            />
                          </div>
                          <div className="col-4 paddl">
                            <input
                              type="reset"
                              className="btn btn-danger"
                              onClick={() => removeXTag(a)}
                              value="Remove"
                            />
                          </div>
                        </div>
                      );
                    })}
                  <div className="col-12 col-sm-6 col-lg-4 mb-2 row">
                    <div className="col-8 paddr">
                      <input
                        type="text"
                        name="xtag"
                        value={xtag}
                        onChange={(e) => setXTag(e.target.value)}
                        className="form-control"
                        id="tags"
                        aria-describedby="tags"
                        placeholder="Enter Project tag"
                      />
                    </div>
                    <div className="col-4 paddl">
                      <button
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXTag}
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

                <div className="form-group my-1">
                  <label htmlFor="content">Project Content :</label>
                </div>
                <div className="form-group mb-4">
                  <JoditEditor
                    name="content"
                    className="jodit-editor-border"
                    ref={editor}
                    value={proj ? proj.content : ""}
                    config={editorConfig}
                    onChange={handleValue}
                  />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="form-group my-1">
                  <label>Collaborators :</label>
                </div>
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
                        {user._id !== t.id && proj.creator !== t.id && (
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
                      <option value="">Select Collaborator</option>
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
                      Add
                    </button>
                  </div>
                </div>
                <div className="form-group my-3">
                  <label for="photo">Project Cover Photo :</label>
                  <div className="">
                    <input
                      type="file"
                      accept="image/*"
                      name="photo"
                      onChange={handlePhoto}
                      className="form-control"
                      id="photo"
                      aria-describedby="photo"
                    />
                  </div>
                </div>
                <div className="form-group mt-2 mb-4">
                  <img
                    src={photo ? photo : proj.cover}
                    alt={proj.title}
                    style={{ width: "100%", objectFit: "contain" }}
                  />
                </div>
                <div className="form-group my-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      data-bs-toggle="collapse"
                      href="#collapseExample"
                      type="checkbox"
                      aria-expanded={proj.isPublished}
                      aria-controls="collapseExample"
                      onChange={handlePublished}
                      checked={proj.isPublished}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Is research paper published?
                    </label>
                  </div>
                </div>
                <div
                  className={`collapse ${proj.isPublished ? "show" : ""}`}
                  id="collapseExample"
                >
                  <div className="form-group my-2 row">
                    <div className="col col-9 my-2">
                      <div className="form-group mb-1">
                        <label htmlFor="title">Publication Link :</label>
                      </div>
                      <input
                        name="researchPaperLink"
                        type="text"
                        value={proj.researchPaperLink}
                        className="form-control"
                        id="researchPaperLink"
                        aria-describedby="title"
                        placeholder="Enter Research Paper Link"
                        onChange={handleInputs}
                        required={proj.isPublished}
                      />
                    </div>
                    <div className="col col-9">
                      <div className="form-group mb-1">
                        <label htmlFor="title">Publisher :</label>
                      </div>
                      <input
                        name="publisher"
                        type="text"
                        value={proj.publisher}
                        className="form-control"
                        id="researchPaperLink"
                        aria-describedby="title"
                        placeholder="Enter Publisher Name"
                        onChange={handleInputs}
                        required={proj.isPublished}
                      />
                    </div>
                  </div>
                  <div className="form-group my-1">
                    <label>Co-Authors :</label>
                  </div>
                  {proj &&
                    proj.coAuthors.map((a, i) => {
                      return (
                        <div className="form-group my-2 row" key={i}>
                          <div className="col col-9">
                            <input
                              type="text"
                              value={a}
                              className="form-control"
                              id="CoAuthor"
                              aria-describedby="title"
                              disabled
                            />
                          </div>
                          <div className="col col-3">
                            {user.username !== a && proj.creator !== a && (
                              <input
                                type="reset"
                                className="btn btn-danger"
                                onClick={() => removeXCoAuthor(a)}
                                value="Remove"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  <div className="form-group my-2 row">
                    <div className="col col-9">
                      <input
                        type="text"
                        name="xtag"
                        value={xCoAuthor}
                        onChange={(e) => setXCoAuthor(e.target.value)}
                        className="form-control"
                        id="tags"
                        aria-describedby="tags"
                        placeholder="Enter Co-Author Name"
                      />
                    </div>
                    <div className="col col-3">
                      <button
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXCoAuthor}
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
                <div>
                  {add ? (
                    <button
                      type="submit"
                      name="submit"
                      id="submit"
                      className="btn btn-primary my-3"
                      disabled
                    >
                      Saving <i className="fa fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      name="submit"
                      id="submit"
                      className="btn btn-primary my-3"
                      onClick={() => {
                        setProj({
                          ...proj,
                          approvalStatus: "submit",
                          public: false,
                        });
                      }}
                    >
                      Save as Draft
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default EditProject;
