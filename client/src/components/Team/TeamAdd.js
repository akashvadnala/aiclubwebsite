import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../Context/Context';
import { SERVER_URL } from '../../EditableStuff/Config';
import Error from '../Error';
import Loading from '../Loading';
import { alertContext } from '../../Context/Alert';

const TeamAdd = () => {
    const navigate = useNavigate();
    const { showAlert } = useContext(alertContext);
    const { user, logged_in } = useContext(Context);
    const [team, setTeam] = useState({
        firstname: "",
        lastname: "",
        position: "",
        username: "",
        email: "",
        year: "",
        photo: "",
        password: "",
        cpassword: "",
        isadmin: false,
        ismember: false,
        isalumni: false,
        canCreateCompetitions: false,
    });

    const [load, setLoad] = useState(0);
    const [add, setAdd] = useState(false);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        if (logged_in === 1) {
            if (user.isadmin) {
                setLoad(1);
            }
            else {
                setLoad(-1)
            }
        }
        else if (logged_in === -1) {
            setLoad(-1);
        }
    }, [logged_in]);

    const d = new Date();
    var y = d.getFullYear();
    const ly = 2019;

    const handleInputs = (e) => {
        setTeam({ ...team, [e.target.name]: e.target.value });
    }
    const handlePhoto = (e) => {
        setTeam({ ...team, [e.target.name]: e.target.files[0] });
        setPhoto(URL.createObjectURL(e.target.files[0]));
    }
    const handleCheck = (e) => {
        setTeam({ ...team, [e.target.name]: e.target.checked });
    }

    const PostTeam = async (e) => {
        e.preventDefault();
        try {
            setAdd(true);
            const data = new FormData();
            data.append("photo", team.photo);

            const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
            team.photo = img.data;

            if (team.year > y) {
                team.year = y;
            }
            else if (team.year < ly) {
                team.year = ly;
            }
            team.ismember = team.ismember || team.isadmin;
            await axios.post(`${SERVER_URL}/teamadd`,
                team,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );
            showAlert("Team Member Added Successfully!", "success");
            navigate('/team');
        } catch (err) {
            setAdd(false);
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
            'id': 'position',
            'des': 'position',
            'val': team.position,
            'req': true
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
            'type': 'password',
            'id': 'password',
            'des': 'Password',
            'val': team.password,
            'req': true
        },
        {
            'type': 'password',
            'id': 'cpassword',
            'des': 'Confirm Password',
            'val': team.cpassword,
            'req': true
        }
    ]

    return (
        <>
            {load === 0 ? <Loading /> : load === 1 ?
                <div className='profile-update-container'>
                    <div className='profile-update adjust pb-4'>
                        <div className='text-header py-4'>Add Team Member</div>
                        <form method="POST" onSubmit={PostTeam} encType="multipart/form-data">
                            {
                                forms.map((f) => {
                                    return (
                                        <div className="form-group mb-3 align-items-center row">
                                            <label for={f.id} className='col-sm-2 text-end'>{f.des} :</label>
                                            <div className='col-sm-10'>
                                                <input type={f.type} name={f.id} value={f.val} onChange={handleInputs} className="form-control" id={f.id} aria-describedby={f.id} placeholder={`Enter ${f.des}`} required={f.req} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="form-group align-items-center row">
                                <label for='photo' className='col-sm-2 text-end'>Upload Photo :</label>
                                <div className='col-sm-10'>
                                    <input type='file' accept="image/*" name="photo" onChange={handlePhoto} className="form-control" id='photo' aria-describedby='photo' required />
                                </div>
                            </div>
                            {(photo || team.photo) && <div className="form-group mt-3 align-items-center row">
                                <div className=" col-8 col-md-3">
                                    <img src={photo ? photo : team.photo} alt={team.firstname} style={{ width: "100%", objectFit: "contain" }} />
                                </div>
                            </div>}
                            <div className="form-group form-check mt-3  align-items-center">
                                <input type="checkbox" checked={team.isadmin} name="isadmin" onChange={handleCheck} className="form-check-input" id="admin" />
                                <label className="form-check-label" for="admin">Make Admin</label>
                            </div>
                            <div className="form-group form-check mt-3 align-items-center">
                                <input type="checkbox" checked={team.ismember} name="ismember" onChange={handleCheck} className="form-check-input" id="member" />
                                <label className="form-check-label" for="member">Make Member</label>
                            </div>
                            <div className="form-group form-check mt-3 align-items-center">
                                <input type="checkbox" checked={team.isalumni} name="isalumni" onChange={handleCheck} className="form-check-input" id="isalumni" />
                                <label className="form-check-label" for="isalumni">Make Alumni</label>
                            </div>
                            {
                                team.isalumni &&
                                <div className="form-group my-3 row">
                                    <label for="year" className='col-sm-2 text-end'>Year of Alumni :</label>
                                    <div className='col-sm-10'>
                                        <input type="text" name="year" value={team.year} onChange={handleInputs} className="form-control" id="year" aria-describedby="year" placeholder={`Enter Year of Alumni`} required />
                                    </div>
                                </div>
                            }
                            {/* <div className="form-group form-check my-3">
                        <input type="checkbox" checked={team.canCreateCompetitions} name="canCreateCompetitions" onChange={handleCheck} className="form-check-input" id="canCreateCompetitions" />
                        <label className="form-check-label" for="canCreateCompetitions">Can Create Competitions</label>
                    </div> */}

                            <button type="submit" name="submit" id="submit" className="btn btn-primary mt-3" disabled={add}>
                                {add ? <>Submitting <i className="fa fa-spinner fa-spin"></i></> : <>Submit</>}
                            </button>
                        </form>
                    </div>
                </div>
                : <Error />}
        </>
    )
}

export default TeamAdd;