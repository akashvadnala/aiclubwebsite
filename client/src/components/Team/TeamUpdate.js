import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Context } from '../../Context/Context';
import { SERVER_URL } from '../../EditableStuff/Config';
import Loading from '../Loading';
import Error from '../Error';

const TeamUpdate = () => {
    const navigate = useNavigate();
    const params = new useParams();
    const username = params.username;
    // console.log(username);
    const [team, setTeam] = useState([]);
    const [checkbox, setCheckbox] = useState(false);
    const [Img, setImg] = useState();
    const [photo, setPhoto] = useState(null);
    const [submit, setSubmit] = useState(false);
    // const { user } = useContext(Context);
    const [load, setLoad] = useState(0);
    const getUserDataForEdit = async () => {
        try {
            axios.get(`${SERVER_URL}/getUserData`,
                { withCredentials: true })
                .then(async data => {
                    if (data.status === 200) {
                        const user = data.data;
                        const res = await axios.get(`${SERVER_URL}/getUserDataForEdit/${username}`);
                        if (res.status === 200) {
                            setTeam(res.data);
                            if (user.isadmin) {
                                if (user.username !== res.data.username) {
                                    setCheckbox(true);
                                }
                                setLoad(1);
                            }
                        }
                        else {
                            setLoad(-1);
                        }
                    }
                    else {
                        setLoad(-1);
                    }
                })
        } catch (err) {
            console.log(err);
            setLoad(-1);
        }
    }

    useEffect(() => {
        getUserDataForEdit();
    }, []);


    const d = new Date();
    var y = d.getFullYear();
    const ly = 2019;

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        console.log(name);
        console.log(value);
        setTeam({ ...team, [name]: value });
        console.log('team', team);
    }


    const handleCheck = (e) => {
        const name = e.target.name;
        const checked = e.target.checked
        setTeam({ ...team, [name]: checked });
    }

    const handlePhoto = (e) => {
        setImg(e.target.files[0]);
        setPhoto(URL.createObjectURL(e.target.files[0]));
    }

    const UpdateTeam = async (e) => {
        e.preventDefault();
        setSubmit(true);
        team.ismember = team.ismember || team.isadmin;
        var imgurl;
        if (Img) {
            const data = new FormData();
            const photoname = Date.now() + Img.name;
            data.append("name", photoname);
            data.append("photo", Img);

            try {
                await axios.post(`${SERVER_URL}/imgdelete`,
                    { 'url': team.photo },
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
                team.photo = imgurl;
            } catch (err) {
                console.log('photoerr', err);
            }
        }
        console.log('imgurl', imgurl);
        try {
            if (team.year > y) {
                team.year = y;
            }
            else if (team.year < ly) {
                team.year = ly;
            }
            const teamdata = await axios.put(`${SERVER_URL}/teamupdate/${team._id}`,
                team,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            console.log('teamdata', teamdata);
            if (teamdata.status === 422 || !teamdata) {
                console.log('Username not found');
            }
            else {
                navigate('/team');
            }
        } catch (err) {
            console.log('err', err);
        }
    }


    const forms = [
        {
            'type': 'text',
            'id': 'firstname',
            'des': 'First Name',
            'val': team.firstname
        },
        {
            'type': 'text',
            'id': 'lastname',
            'des': 'Last Name',
            'val': team.lastname
        },
        {
            'type': 'text',
            'id': 'profession',
            'des': 'Profession',
            'val': team.profession
        },
        {
            'type': 'text',
            'id': 'description',
            'des': 'Description',
            'val': team.description
        },
        {
            'type': 'email',
            'id': 'email',
            'des': 'EMail',
            'val': team.email
        },
    ]
    return (
        <>
            {load === 0 ? <Loading /> : load === 1 ?
                <div className='profile-update-container'>
                    <div className='profile-update adjust'>
                        <h3>You are editing '{username}' profile</h3>
                        <form method='POST' encType='multipart/form-data'>
                            {
                                forms.map((f) => {
                                    return (
                                        <div className="form-group my-3 row">
                                            <label for={f.id} className='col-sm-2 text-end'>{f.des} :</label>
                                            <div className='col-sm-10'>
                                                <input type={f.type} name={f.id} value={f.val} onChange={handleInputs} className="form-control" id={f.id} aria-describedby={f.id} placeholder={`Enter ${f.des}`} />
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
                                            <label class="form-check-label" for="alumni">Make Alumni</label>
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
                            {
                                submit ?
                                    <button type="submit" name="submit" id="submit" className="btn btn-primary" disabled>
                                        Updating <i className="fa fa-spinner fa-spin"></i>
                                    </button>
                                    :
                                    <button type="submit" name="submit" id="submit" onClick={UpdateTeam} className="btn btn-primary">
                                        Update
                                    </button>
                            }
                        </form>
                    </div>
                </div>
                : <Error />}
        </>
    )
}

export default TeamUpdate