import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Context } from '../../Context/Context';
import { SERVER_URL } from '../../EditableStuff/Config';
import Loading from '../Loading';
import Error from '../Error';
import { alertContext } from '../../Context/Alert';

const TeamUpdate = () => {
    const navigate = useNavigate();
    const params = new useParams();
    const username = params.username;
    const { showAlert } = useContext(alertContext);
    const [team, setTeam] = useState([]);
    const [teamCopy, setTeamCopy] = useState([]);
    const [checkbox, setCheckbox] = useState(false);
    const [Img, setImg] = useState();
    const [photo, setPhoto] = useState(null);
    const [submit, setSubmit] = useState(false);
    const { user, logged_in } = useContext(Context);
    const [load, setLoad] = useState(0);
    const getUserDataForEdit = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/getUserDataForEdit/${username}`);
            setTeam(res.data);
            setTeamCopy(res.data);
            if (user.username !== res.data.username) {
                setCheckbox(true);
            }
            setLoad(1);
        } catch (err) {
            setLoad(-1);
            showAlert(err.response.data.error)
        }
    }

    useEffect(() => {
        if (logged_in === 1) {
            if (user.isadmin) {
                getUserDataForEdit();
            }
            else {
                setLoad(-1)
            }
        }
        else if (logged_in === -1) {
            setLoad(-1)
        }
    }, [logged_in]);


    const d = new Date();
    var y = d.getFullYear();
    const ly = 2019;

    const handleInputs = (e) => {
        setTeam({ ...team, [e.target.name]: e.target.value });
    }


    const handleCheck = (e) => {
        setTeam({ ...team, [e.target.name]: e.target.checked });
    }

    const handlePhoto = (e) => {
        setImg(e.target.files[0]);
        setPhoto(URL.createObjectURL(e.target.files[0]));
    }

    const UpdateTeam = async (e) => {
        e.preventDefault();
        try {
            if (teamCopy.username !== team.username) {
                await axios.get(`${SERVER_URL}/isUsernameExist/${team.username}`);
            }
            if (teamCopy.email !== team.email) {
                await axios.get(`${SERVER_URL}/isEmailExist/${team.email}`);
            }
            setSubmit(true);
            team.ismember = team.ismember || team.isadmin;
            if (Img) {
                const data = new FormData();
                data.append("photo", Img);
                data.append("category","team");

                await axios.put(`${SERVER_URL}/imgdelete`,
                    { 'url': team.photo },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    });

                const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
                team.photo = img.data;
            }
            if (team.year > y) {
                team.year = y;
            }
            else if (team.year < ly) {
                team.year = ly;
            }
            await axios.put(`${SERVER_URL}/teamupdate/${team._id}`,
                team,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );
            showAlert("Team Updated Successfully!", "success");
            navigate('/team');
        } catch (err) {
            setSubmit(false);
            showAlert(err.response.data.error, "danger");
        }
    }


    const forms = [
        {
            'type': 'text',
            'id': 'firstname',
            'des': 'First Name',
            'val': team.firstname,
            'req': true
        },
        {
            'type': 'text',
            'id': 'lastname',
            'des': 'Last Name',
            'val': team.lastname,
            'req': false
        },
        {
            'type': 'text',
            'id': 'username',
            'des': 'Username',
            'val': team.username,
            'req': true
        },
        {
            'type': 'email',
            'id': 'email',
            'des': 'EMail',
            'val': team.email,
            'req': true
        },
        {
            'type': 'text',
            'id': 'position',
            'des': 'position',
            'val': team.position,
            'req': true
        },
        {
            'type': 'text',
            'id': 'phone',
            'des': 'Contact No',
            'val': team.phone,
            'req': false
        },
        {
            'type': 'text',
            'id': 'profession',
            'des': 'Profession',
            'val': team.profession,
            'req': false
        },
        {
            'type': 'text',
            'id': 'description',
            'des': 'Description',
            'val': team.description,
            'req': false
        },
    ]
    return (
        <>
            {load === 0 ? <Loading /> : load === 1 ?
                <div className='profile-update-container pb-4'>
                    <div className='profile-update adjust'>
                        <div className='text-header py-4'>You are editing '{username}' profile</div>
                        <form method='POST' encType='multipart/form-data'>
                            {
                                forms.map((f) => {
                                    return (
                                        <div className="form-group my-3 row">
                                            <label for={f.id} className='col-sm-2 text-end'>{f.des} :</label>
                                            <div className='col-sm-10'>
                                                <input type={f.type} name={f.id} value={f.val} onChange={handleInputs} className="form-control" id={f.id} aria-describedby={f.id} placeholder={`Enter ${f.des}`} required={f.req} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="form-group my-3 row">
                                <label for='photo' className='col-sm-2 text-end'>Upload Photo :</label>
                                <div className='col-sm-10'>
                                    <input type='file' accept=".png, .jpg, .jpeg" name='photo' onChange={handlePhoto} className="form-control" id='photo' aria-describedby='photo' />
                                </div>
                            </div>
                            <div className="form-group my-3 row">
                                <div className=" col-8 col-md-3">
                                    <img src={photo ? photo : team.photo} alt={team.firstname} style={{ width: "100%", objectFit: "contain" }} />
                                </div>
                            </div>
                            {
                                checkbox ?
                                    <>
                                        <div className="form-group form-check my-3">
                                            <input type="checkbox" checked={team.isadmin} name="isadmin" onChange={handleCheck} className="form-check-input" id="admin" />
                                            <label className="form-check-label" for="admin">Make Admin</label>
                                        </div>
                                        <div className="form-group form-check my-3">
                                            <input type="checkbox" checked={team.ismember} name="ismember" onChange={handleCheck} className="form-check-input" id="member" />
                                            <label className="form-check-label" for="member">Make Member</label>
                                        </div>
                                        <div className="form-group form-check my-3">
                                            <input type="checkbox" checked={team.isalumni} name="isalumni" onChange={handleCheck} className="form-check-input" id="alumni" />
                                            <label className="form-check-label" for="alumni">Make Alumni</label>
                                        </div>
                                        {
                                            team.isalumni ?
                                                <div className="form-group my-3 row">
                                                    <label for="year" className='col-sm-2 text-end'>Year of Alumni :</label>
                                                    <div className='col-sm-10'>
                                                        <input type="text" name="year" value={team.year} onChange={handleInputs} className="form-control" id="year" aria-describedby="year" placeholder={`Enter Year of Alumni`} required />
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                        {/* <div className="form-group form-check my-3">
                                    <input type="checkbox" checked={team.canCreateCompetitions} name="canCreateCompetitions" onChange={handleCheck} className="form-check-input" id="canCreateCompetitions" />
                                    <label className="form-check-label" for="canCreateCompetitions">Can Create Competitions</label>
                                </div> */}
                                    </>
                                    :
                                    null
                            }
                            <button type="submit" name="submit" id="submit" onClick={UpdateTeam} className="btn btn-primary mt-4" disabled={submit}>
                                {submit ? <>Updating <i className="fa fa-spinner fa-spin"></i></> : <>Update</>}
                            </button>
                        </form>
                    </div>
                </div>
                : <Error />}
        </>
    )
}

export default TeamUpdate