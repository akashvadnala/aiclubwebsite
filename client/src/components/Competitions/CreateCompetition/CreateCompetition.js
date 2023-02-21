import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import { alertContext } from "../../../Context/Alert";
import { CLIENT_URL, SERVER_URL } from "../../../EditableStuff/Config";
import Loading from "../../Loading";
import Error from "../../Error";
import { Context } from "../../../Context/Context";

const CreateCompetition = () => {
  const navigate = useNavigate();
  const { user, logged_in } = useContext(Context);
  const [compete, setCompete] = useState({
    url: "",
    title: "",
    subtitle: "",
    headerPhoto: "",
    creator: user ? user._id : null,
    access: [],
    public: false,
    CompetitionStart: new Date(),
    CompetitionEnd: new Date()
  });
  const { showAlert } = useContext(alertContext);
  const [load, setLoad] = useState(0);
  const [xaccess, setXAccess] = useState("");
  const [msg, setMsg] = useState(null);
  const [add, setAdd] = useState(false);
  const [teams, setTeams] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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
        setCompete({ ...compete, ["creator"]: user._id, ["access"]:[user._id] });
        setLoad(1);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (logged_in === 1) {
      if (user.isadmin) {
        getTeams();
        setLoad(1);
      } else {
        setLoad(-1);
      }
    } else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in]);

  const removeXAccess = (author) => {
    let current = projTeams.filter(t => t.id === author);
    projTeam = projTeams.filter(t => t.id !== author);
    team = teams;
    team.push(current[0]);
    setTeams(team);
    setProjTeams(projTeam);
    let authors = compete.access.filter(a => a !== author);
    setCompete({ ...compete, ["access"]: authors });
    setXAccess("");
  };

  const AddXAccess = () => {
    if (xaccess !== "") {
      let current = teams.filter((t) => t.id === xaccess);
      team = teams.filter((t) => t.id !== xaccess);
      projTeam = projTeams;
      projTeam.push(current[0]);
      setTeams(team);
      setProjTeams(projTeam);
      let authors = compete.access;
      authors.push(xaccess);
      setCompete({ ...compete, ["access"]: authors });
      setXAccess("");
    }
  };

  const handleHeaderPhoto = (e) => {
    setCompete({ ...compete, ["headerPhoto"]: e.target.files[0] });
  };

  const seteventStartDate = (date) => {
    setStartDate(date);
    setCompete({ ...compete, ["CompetitionStart"]: date });
  };

  const seteventEndDate = (date) => {
    setEndDate(date);
    setCompete({ ...compete, ["CompetitionEnd"]: date });
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setCompete({ ...compete, [name]: value });
  };
  
  const handleUrl = (e) => {
    let value = e.target.value;
    let url="";
    for(let i=0;i<value.length;i++){
      const c = value[i];
      if(("a"<=c && c<="z") || ("A"<=c && c<="Z") || ("0"<=c && c<="9") || c==="-" || c==='_'){
        url+=c;
      }
      else{
        showAlert("Special Characters are not allowed except '-' and '_'","danger");
      }
    }
    setCompete({...compete,url:url});
  }

  const createCompete = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${SERVER_URL}/isCompUrlExist/${compete.url}`);
      setAdd(true);
      const data = new FormData();
      data.append("photo", compete.headerPhoto);
      const img = await axios.post(`${SERVER_URL}/imgupload`, data, {
        withCredentials: true,
      });
      compete.headerPhoto = img.data;
      console.log("Competition",compete);
      const competedata = await axios.post(
        `${SERVER_URL}/addcompetitions`,
        compete,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate(`/competitions/${compete.url}`);
      showAlert("Competition created sucessfully!", "success");
    } catch (error) {
      showAlert(`${error.response.data.error}`, "danger");
    }
    setAdd(false);
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="createCompetition-container">
          <div className="adjust">
            <h3>Create Competition</h3>
            <form
              method="POST"
              onSubmit={createCompete}
              encType="multipart/form-data"
            >
              <div className="form-group my-3 row align-items-center">
                <label htmlFor="title" className="col-sm-2 text-end">
                  Title :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="title"
                    value={compete.title}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder={`Enter Competition title`}
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row align-items-center">
                <label htmlFor="subtitle" className="col-sm-2 text-end">
                  Subtitle :
                </label>
                <div className="col-sm-10">
                  <input
                    name="subtitle"
                    onChange={handleInputs}
                    className="form-control"
                    id="subtitle"
                    aria-describedby="subtitle"
                    value={compete.subtitle}
                    placeholder={`Enter Competition subtitle`}
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row align-items-center">
                <label htmlFor="url" className="col-sm-2 text-end">
                  Url :
                </label>
                <div className="col-sm-10">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text text-end"
                        id="basic-addon3"
                      >
                        {CLIENT_URL}/competitions/
                      </span>
                    </div>
                    <input
                      type="text"
                      name="url"
                      value={compete.url}
                      onChange={handleUrl}
                      className="form-control"
                      id="url"
                      aria-describedby="url"
                      placeholder={`Enter Competition url`}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="photo" className="col-sm-2 text-end">
                  Start Time :
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => seteventStartDate(date)}
                    showTimeSelect
                    minDate={new Date()}
                    filterTime={filterPassedTime}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="photo" className="col-sm-2 text-end">
                  End Time :
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => seteventEndDate(date)}
                    showTimeSelect
                    minDate={new Date()}
                    filterTime={filterPassedTime}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="url" className="col-sm-2 text-end">
                  Host Access :
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
                              onClick={() => removeXAccess(t.id)}
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
                        value={xaccess}
                        onChange={(e) => setXAccess(e.target.value)}
                        className="form-select"
                        aria-label="authors"
                      >
                        <option value="">Select Author</option>
                        {teams.map((t,i) => {
                          return <option value={t.id} key={i}>{t.name}</option>;
                        })}
                      </select>
                    </div>
                    <div className="col col-3">
                      <button
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXAccess}
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
                <label htmlFor="photo" className="col-sm-2 text-end">
                  Header Image :
                </label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handleHeaderPhoto}
                    className="form-control"
                    id="photo"
                    aria-describedby="photo"
                    required
                  />
                </div>
              </div>
              <div className="form-group form-check my-3">
                <input
                  type="checkbox"
                  name="public"
                  checked={compete.public}
                  onChange={(e) => {
                    setCompete({ ...compete, public: e.target.checked });
                  }}
                  className="form-check-input"
                  id="public"
                />
                <label className="form-check-label" htmlFor="public">
                  Public
                </label>
              </div>
              {
                add ?
                  <button type="submit" name="submit" id="submit" className="btn btn-primary" disabled>
                    Creating <i className="fa fa-spinner fa-spin"></i>
                  </button>
                  :
                  <button type="submit" name="submit" id="submit" className="btn btn-primary">
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

export default CreateCompetition;
