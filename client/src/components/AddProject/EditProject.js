import React, { useRef, useState, useMemo, useContext, useEffect } from "react";
import "./AddProject.css";
import JoditEditor from "jodit-react";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Error from "../Error";
import axios from "axios";
import { CLIENT_URL, SERVER_URL } from "../../EditableStuff/Config";
import Loading from "../Loading";
import { Helmet } from "react-helmet";

const EditProject = () => {
  const { url } = useParams();
  const editor = useRef(null);
  const navigate = useNavigate();
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
      // getTeams
      team = [];
      teamArray = [];
      let projTeam = [];
      try {
        axios.get(`${SERVER_URL}/getTeams`).then((data) => {
          teamArray = data.data;
          team = teamArray;
        });
      } catch (err) {
        console.log(err);
      }
      // getProject
      axios.get(`${SERVER_URL}/getProjectEdit/${url}`).then(async (data) => {
        if (data.status === 200) {
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
        } else {
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (logged_in === 1) {
      if (url) {
        getProject();
      }
      else{
        setLoad(-1);
      }
    } else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in, url]);

  const handlePhoto = (e) => {
    setImg(e.target.files[0]);
    setPhoto(URL.createObjectURL(e.target.files[0]));
  }

  const handleValue = (e) => {
    setProj({ ...proj, ["content"]: e });
    setPreview(false);
  };

  const handlePublished = () => {
    setProj({ ...proj, ["isPublished"]: !proj.isPublished });
    setPreview(false);
  };

  const handleInputs = (e) => {
    setProj({ ...proj, [e.target.name]: e.target.value });
    setPreview(false);
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
      setProj({ ...proj, ["authors"]: authors });
      setXAuthor("");
      setPreview(false);
    }
  };
  const removeXTag = (tag) => {
    let current = proj.tags;
    current = current.filter((x) => x !== tag);
    setProj({ ...proj, ["tags"]: current });
    setXTag("");
    setPreview(false);
  };
  const AddXTag = () => {
    let current = proj.tags;
    current.push(xtag);
    setProj({ ...proj, ["tags"]: current });
    setXTag("");
    setPreview(false);
  };

  const removeXCoAuthor = (coAuthor) => {
    let current = proj.coAuthors;
    current = current.filter((x) => x !== coAuthor);
    setProj({ ...proj, ["coAuthors"]: current });
    setXCoAuthor("");
    setPreview(false);
  };
  const AddXCoAuthor = () => {
    let current = proj.coAuthors;
    current.push(xCoAuthor);
    setProj({ ...proj, ["coAuthors"]: current });
    setXCoAuthor("");
    setPreview(false);
  };
  console.log('proj', proj);
  const UpdateProject = async (e) => {
    e.preventDefault();
    try {
      if(url!==proj.url){
        const projectExist = await axios.get(`${SERVER_URL}/isProjectUrlExist/${proj.url}`);
        if (projectExist.status === 200) {
          showAlert("Url Already Exist!", "danger");
          return ; 
        }
      }
      
      setAdd(true);
        var imgurl;
        if (Img) {
          const data = new FormData();
          const photoname = Date.now() + Img.name;
          data.append("name", photoname);
          data.append("photo", Img);

          try {
            await axios.post(`${SERVER_URL}/imgdelete`,
              { 'url': proj.cover },
              {
                headers: { "Content-Type": "application/json" },
              });
          } catch (err) {
            console.log('photoerr', err);
          }

          try {
            const img = await axios.post(`${SERVER_URL}/imgupload`, data);
            console.log('img', img);
            imgurl = img.data;
            proj.cover = imgurl;
          } catch (err) {
            console.log('photoerr', err);
          }
        }
        console.log('imgurl', imgurl);
        try {
          const projdata = await axios.put(
            `${SERVER_URL}/updateProject/${proj._id}`,
            proj,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log("projdata", projdata);
          if (projdata.status === 422 || !projdata) {
            showAlert("Failed to save", "danger");
          } else {
            setAdd(false);
            showAlert("Saved as Draft", "success");
            setPreview(true);
          }
        } catch (err) {
          console.log("err", err);
        }
    } catch (err) {
      console.log(err);
    }

  };
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container addproject-container py-3">
          <Helmet>
            <title>Project - AI Club</title>
          </Helmet>
          <h3 className="text-center">Edit Project</h3>
          <div className="text-center fs-6 pb-1">
            {preview ? (
              <NavLink
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
                      <input
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXTag}
                        value="+Add"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group my-1">
                  <label htmlFor="content">Project Content :</label>
                </div>
                <div className="form-group mb-4">
                  {/* {
                            useMemo( () => ( 
                              <JoditEditor name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleInputs} /> 
                            ),[proj.content])
                          } */}
                  <JoditEditor
                    name="content"
                    ref={editor}
                    value={proj ? proj.content : ""}
                    onChange={handleValue}
                  />
                  {/* <Jodit name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleInputs} /> */}
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
                    <input
                      type="reset"
                      className="btn btn-success"
                      onClick={AddXAuthor}
                      value="+Add"
                    />
                  </div>
                </div>
                <div className="form-group my-3">
                  <label for="photo">
                    Project Cover Photo :
                  </label>
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
                  <img src={photo ? photo : proj.cover} alt={proj.title} style={{ width: "100%", objectFit: "contain" }} />
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
                      <input
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXCoAuthor}
                        value="+Add"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {
                    add ?
                      <button
                        type="submit"
                        name="submit"
                        id="submit"
                        className="btn btn-primary my-3"
                        disabled
                      >
                        Saving <i className="fa fa-spinner fa-spin"></i>
                      </button>
                      :
                      <button
                        type="submit"
                        name="submit"
                        id="submit"
                        className="btn btn-primary my-3"
                        onClick={() => { setProj({ ...proj, ["approvalStatus"]: "submit", ["public"]: false }); }}
                      >
                        Save as Draft
                      </button>
                  }
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
