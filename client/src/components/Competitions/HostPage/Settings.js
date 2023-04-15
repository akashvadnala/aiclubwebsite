import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CLIENT_URL, SERVER_URL } from '../../../EditableStuff/Config';
import Error from '../../Error';
import Loading from '../../Loading';
import { alertContext } from '../../../Context/Alert';
import { Context } from '../../../Context/Context';
import DatePicker from "react-datepicker";

const Settings = ({ props }) => {

  const navigate = useNavigate();
  const { user, logged_in } = useContext(Context);
  const [compete, setCompete] = useState(null);
  const { showAlert } = useContext(alertContext);
  const [load, setLoad] = useState(0);
  const [xaccess, setXAccess] = useState("");
  const [msg, setMsg] = useState(null);
  const [add, setAdd] = useState(false);
  const [teams, setTeams] = useState([]);
  const [accessTeams, setAccessTeams] = useState([]);
  const [Img, setImg] = useState();
  const [photo, setPhoto] = useState(null);
  let team = [];
  let accessTeam = [];
  let teamArray = [];
  const getTeams = () => {
    try {
      axios.get(`${SERVER_URL}/getTeams`).then(async (data) => {
        teamArray = data.data;
        accessTeam = []
        await Promise.all(
          props && props.c && props.c.access.map((a) => {
            accessTeam.push(teamArray.filter((t) => t.id === a)[0]);
            teamArray = teamArray.filter((t) => t.id !== a);
          })
        )
        setTeams(teamArray);
        setAccessTeams(accessTeam);
        setLoad(1);
      });
    } catch (err) {
      console.log(err);
      setLoad(-1);
    }
  };
  console.log('props', props)
  useEffect(() => {
    setCompete(props.c);
    getTeams();
  }, [logged_in, props]);

  const removeXAccess = (author) => {
    let current = accessTeams.filter(t => t.id === author);
    accessTeam = accessTeams.filter(t => t.id !== author);
    team = teams;
    team.push(current[0]);
    setTeams(team);
    setAccessTeams(accessTeam);
    let authors = compete.access.filter(a => a !== author);
    setCompete({ ...compete, access: authors });
    setXAccess("");
  };

  const AddXAccess = () => {
    if (xaccess !== "") {
      let current = teams.filter((t) => t.id === xaccess);
      team = teams.filter((t) => t.id !== xaccess);
      accessTeam = accessTeams;
      accessTeam.push(current[0]);
      setTeams(team);
      setAccessTeams(accessTeam);
      let authors = compete.access;
      authors.push(xaccess);
      setCompete({ ...compete, access: authors });
      setXAccess("");
    }
  };

  const handleHeaderPhoto = (e) => {
    setImg(e.target.files[0]);
    setPhoto(URL.createObjectURL(e.target.files[0]));
  };

  const setCompeteStartDate = (date) => {
    // setStartDate(date);
    setCompete({ ...compete, CompetitionStart: date });
  };

  const setCompeteEndDate = (date) => {
    // setEndDate(date);
    setCompete({ ...compete, CompetitionEnd: date });
  };

  // const filterPassedTime = (time) => {
  //   const currentDate = new Date();
  //   const selectedDate = new Date(time);
  //   return currentDate.getTime() < selectedDate.getTime();
  // };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setCompete({ ...compete, [name]: value });
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
    setCompete({ ...compete, url: url });
  }

  const updateCompetetion = async (e) => {
    e.preventDefault();
    try {
      setAdd(true);
      if (Img) {
        const data = new FormData();
        data.append("photo", Img);
        data.append("category","competitions");

        await axios.put(`${SERVER_URL}/imgdelete`,
          { 'url': compete.headerPhoto },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          });

        const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
        compete.headerPhoto = img.data;
      }
      await axios.put(`${SERVER_URL}/updateCompetetion/${compete._id}`,
        compete,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      showAlert("Competition Updated Successfully!", "success");
    } catch (err) {
      showAlert(err.response.data.error, "danger");
    }
    setAdd(false);
  }

  const deleteCompete = async () => {
    const confirmed = window.confirm(`Are you sure to delete the competition ${props.c.title}?`);
    if (confirmed) {
      const res = await axios.post(`${SERVER_URL}/deleteCompete/${props.c._id}`);
      if (res.status === 200) {
        console.log('Compeition Deleted');
        navigate('/');
      }
      else {
        console.log('Competition Cannot be Deleted');
      }
    }
  }

  return (
    <>
      {load === 0 ? <Loading /> : load === 1 ?
        <>
          <div className='settings-container py-2'>
            <div className='card'>
              <div className='card-body pt-0 pb-4'>
                <div className="text-header  py-4">Settings</div>
                {compete && <form
                  method="POST"
                  onSubmit={updateCompetetion}
                  encType="multipart/form-data"
                >
                  <div className="form-group row align-items-center">
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
                  <div className="form-group mt-3 row align-items-center">
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
                      />
                    </div>
                  </div>
                  <div className="form-group mt-3 row align-items-center">
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
                  <div className="form-group mt-3 row align-items-center">
                    <label htmlFor="photo" className="col-sm-2 text-end">
                      Start Time :
                    </label>
                    <div className="col-sm-10">
                      <DatePicker
                        className="form-control"
                        selected={new Date(compete.CompetitionStart)}
                        onChange={(date) => setCompeteStartDate(date)}
                        showTimeSelect
                        // minDate={new Date()}
                        // filterTime={filterPassedTime}
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                  </div>
                  <div className="form-group mt-3 row align-items-center">
                    <label htmlFor="photo" className="col-sm-2 text-end">
                      End Time :
                    </label>
                    <div className="col-sm-10">
                      <DatePicker
                        className="form-control"
                        selected={new Date(compete.CompetitionEnd)}
                        onChange={(date) => setCompeteEndDate(date)}
                        showTimeSelect
                        // minDate={new Date()}
                        // filterTime={filterPassedTime}
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                  </div>
                  <div className="form-group mt-3 row">
                    <label htmlFor="url" className="col-sm-2 mt-2 text-end">
                      Host Access :
                    </label>
                    <div className="col-sm-10">
                      {accessTeams.map((t, i) => {
                        return (
                          <div className="form-group mb-2 row" key={i}>
                            <div className="col col-9">
                              <input
                                type="text"
                                value={t.name}
                                className="form-control"
                                id={`author-${i}`}
                                aria-describedby="title"
                                disabled
                              />
                            </div>
                            <div className="col col-3">
                              {user._id !== t.id && t.id !== props.c.creator && (
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
                      <div className="form-group row align-items-center">
                        <div className="col col-9">
                          <select
                            name="xauthor"
                            value={xaccess}
                            onChange={(e) => setXAccess(e.target.value)}
                            className="form-select"
                            aria-label="authors"
                          >
                            <option value="">Select User</option>
                            {teams.map((t, i) => {
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
                  <div className="form-group mt-3 row align-items-center">
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
                      />
                    </div>
                  </div>
                  <div className="form-group row mt-3 align-items-center">
                    <div className="col-sm-2">.</div>
                    <div className="col-sm-10">
                      <img src={photo ? photo : compete.headerPhoto} alt={compete.title} style={{ width: "250px", height: "120px", borderRadius: "5px" }} />
                    </div>
                  </div>
                  <div className="form-group row mt-3 align-items-center">
                    <div className="col-sm-2">Maximum Daily Submissions :</div>
                    <div className="col-sm-10">
                      <input className="form-control" type="text" id="number" value={`${compete.submissionLimit}`} style={{ width: "75px" }} onChange={(e) => setCompete({ ...compete, submissionLimit: e.target.value })}/>
                    </div>
                  </div>
                  <div className="form-group row mt-3 align-items-center">
                    <div className="col-sm-2">.</div>
                    <div className="col-sm-10 form-check">
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
                  </div>
                  <div className=" ">
                    <button type="submit" name="submit" id="submit" className="btn btn-primary mt-4" disabled={add}>
                      {add ? <>Updating <i className="fa fa-spinner fa-spin"></i></> : <>Update</>}
                    </button>
                  </div>

                </form>}
                <div className="text-header  py-4">Delete Competition</div>
                <div className=''>
                  <button className='btn btn-danger' onClick={deleteCompete}>Delete Competition</button>
                </div>
              </div>
            </div>
          </div>
        </>
        : <Error />}
    </>
  )
}

export default Settings
