import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Context } from '../../Context/Context';
import { SERVER_URL } from '../../EditableStuff/Config';

const TeamUpdate = () => {
    const navigate = useNavigate();
    const params = new useParams();
    const username = params.username;
    // console.log(username);
    const [team,setTeam] = useState([]);
    const [checkbox,setCheckbox] = useState(false);
    const [Img, setImg] = useState();
    const [submit,setSubmit] = useState('Update');
    const [submit2,setSubmit2] = useState();
    const { user } = useContext(Context);
    const getUserDataForEdit = async () =>{
        try{
            // const res = await fetch(`/getUserDataForEdit/${username}`,{
            //     method:"GET",
            //     headers:{
            //         "Content-Type":"application/json"
            //     }
            // });
            const res = await axios.get(`${SERVER_URL}/getUserDataForEdit/${username}`);
            // const data = await res.json();
            console.log('Data');
            console.log(res.data);
            setTeam(res.data);
            if(user && user.isadmin){
                if(user.username!==res.data.username){
                    setCheckbox(true);
                }
            }
            else{
                navigate('/team');
            }
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        if(!user || !user.isadmin){
            navigate('/team');
        }
    },[user]);

    useEffect(() => {
        getUserDataForEdit();
    },[team]);

    
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        console.log(name);
        console.log(value);
        setTeam({...team, [name]:value});
        console.log('team',team.isadmin,team.ismember);
    }

    
    const handleCheck = (e) =>{
        const name = e.target.name;
        const checked=e.target.checked
        setTeam({...team,[name]:checked});
    }
    
    const handlePhoto = (e) => {
        setImg(e.target.files[0]);
    }

    const UpdateTeam = async (e) => {
        e.preventDefault();
        setSubmit('Updating');
        setSubmit2(<i class="fa fa-spinner fa-spin"></i>);
        console.log('Postteam');
        // const {firstname,lastname,profession,description,username,photo,email,password,cpassword,isadmin,ismember,canCreateCompetitions} = user;
    
        // const firstname = user.firstname;
        // const lastname = user.lastname;
        // const profession = user.profession;
        // const description = user.description;
        // const username = user.username;
        const photo = team.photo;
        // const email = user.email;
        // const isadmin = user.isadmin;
        // const ismember = user.ismember;
        // console.log(firstname,lastname,profession,description,username,photo,email,isadmin,ismember,canCreateCompetitions);
        team.ismember = team.ismember || team.isadmin;
        var imgurl;
        if(Img){
            const data = new FormData();
            const photoname = Date.now() + Img.name;
            data.append("name",photoname);
            data.append("photo",Img);
    
            try{
                const img = await axios.post(`${SERVER_URL}/imgupload`,data);
                console.log('img',img);
                imgurl = img.data;
                team.photo = imgurl;
            }catch(err){
                console.log('photoerr',err);
            }
        }
        else{
            imgurl = photo;
        }
        console.log('imgurl',imgurl); 
        try{
            const teamdata = await axios.put(`${SERVER_URL}/teamupdate/${username}`,
                team,
                {
                    headers:{"Content-Type" : "application/json"}
                }
            );
            console.log('teamdata',teamdata);
            if(teamdata.status===422 || !teamdata){
                console.log('Username not found');
            }
            else{
                navigate('/team');
            }
        }catch(err){
            console.log('err',err);
        }
    }

    
    const forms=[
        {
            'type':'text',
            'id':'firstname',
            'des':'First Name',
            'val':team.firstname
        },
        {
            'type':'text',
            'id':'lastname',
            'des':'Last Name',
            'val':team.lastname
        },
        {
            'type':'text',
            'id':'profession',
            'des':'Profession',
            'val':team.profession
        },
        {
            'type':'text',
            'id':'description',
            'des':'Description',
            'val':team.description
        },
        {
            'type':'text',
            'id':'username',
            'des':'Username',
            'val':team.username
        },
        {
            'type':'email',
            'id':'email',
            'des':'EMail',
            'val':team.email
        },
        {
            'type':'number',
            'id':'year',
            'des':'Graduation Year',
            'val':team.year
        }
    ]
  return (
    <>
        <div className='profile-update-container'>
            <div className='profile-update adjust'>
                <h3>You are editing '{username}' profile</h3>
                <form method='POST' encType='multipart/form-data'>
                    {
                        forms.map((f)=>{
                            return(
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
                    {
                        checkbox?
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
                                    <input type="checkbox" checked={team.canCreateCompetitions} name="canCreateCompetitions" onChange={handleCheck} className="form-check-input" id="canCreateCompetitions" />
                                    <label className="form-check-label" for="canCreateCompetitions">Can Create Competitions</label>
                                </div>
                            </>
                        :
                            null
                    }
                    <button type="submit" name="submit" id="submit" onClick={UpdateTeam} className="btn btn-primary">{submit} {submit2}</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default TeamUpdate