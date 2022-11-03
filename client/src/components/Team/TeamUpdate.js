import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";

const TeamUpdate = () => {
    const navigate = useNavigate();
    const params = new useParams();
    const username = params.username;
    // console.log(username);
    const [user,setUser] = useState([]);
    const [Img, setImg] = useState();
    const getUserDataForEdit = async () =>{
        try{
            // const res = await fetch(`/getUserDataForEdit/${username}`,{
            //     method:"GET",
            //     headers:{
            //         "Content-Type":"application/json"
            //     }
            // });
            const res = await axios.get(`http://localhost:5000/getUserDataForEdit/${username}`);
            // const data = await res.json();
            console.log('data',res);
            console.log('Data');
            console.log(res.data);
            setUser(res.data);
            if(!res.status===201){
                console.log('err');
                const error = new Error(res.error);
                throw error;
              }
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        getUserDataForEdit();
    },[]);
    
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        console.log(name);
        console.log(value);
        setUser({...user, [name]:value});
    }

    
    const handleCheck = (e) =>{
        setUser({...user, [e.target.name] : e.target.checked});
        console.log('checked',e.target.checked);
    }
    
    const handlePhoto = (e) => {
        setImg(e.target.files[0]);
    }

    const UpdateTeam = async (e) => {
        e.preventDefault();
        console.log('Postteam');
        // const {firstname,lastname,profession,description,username,photo,email,password,cpassword,isadmin,ismember} = user;
    
        const firstname = user.firstname;
        const lastname = user.lastname;
        const profession = user.profession;
        const description = user.description;
        const username = user.username;
        const photo = user.photo;
        const email = user.email;
        const isadmin = user.isadmin;
        const ismember = user.ismember;
        console.log(firstname,lastname,profession,description,username,photo,email,isadmin,ismember);
        
        var imgurl;
        if(Img){
            const data = new FormData();
            const photoname = Date.now() + Img.name;
            data.append("name",photoname);
            data.append("photo",Img);
    
            try{
                const img = await axios.post('http://localhost:5000/imgupload',data);
                console.log('img',img);
                imgurl = img.data;
            }catch(err){
                console.log('photoerr',err);
            }
        }
        else{
            imgurl = photo;
        }
        console.log('imgurl',imgurl); 
        try{
            const teamdata = await axios.put(`http://localhost:5000/teamupdate/${username}`,
                {
                    'firstname':firstname,
                    'lastname':lastname,
                    'profession':profession,
                    'description':description,
                    'username':username,
                    'photo':imgurl,
                    'email':email,
                    'isadmin':isadmin,
                    'ismember':ismember
                },
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
            'val':user.firstname
        },
        {
            'type':'text',
            'id':'lastname',
            'des':'Last Name',
            'val':user.lastname
        },
        {
            'type':'text',
            'id':'profession',
            'des':'Profession',
            'val':user.profession
        },
        {
            'type':'text',
            'id':'description',
            'des':'Description',
            'val':user.description
        },
        {
            'type':'text',
            'id':'username',
            'des':'Username',
            'val':user.username
        },
        {
            'type':'email',
            'id':'email',
            'des':'EMail',
            'val':user.email
        },
        {
            'type':'number',
            'id':'year',
            'des':'Graduation Year',
            'val':user.year
        }
    ]
  return (
    <>
        <div className='profile-update-container'>
            <div className='profile-update adjust'>
                <h1>You are editing '{username}' profile</h1>
                <form method='POST' encType='multipart/form-data'>
                    {
                        forms.map((f)=>{
                            return(
                                <div class="form-group my-3 row">
                                    <label for={f.id} className='col-sm-2 text-end'>{f.des} :</label>
                                    <div className='col-sm-10'>
                                        <input type={f.type} name={f.id} value={f.val} onChange={handleInputs} class="form-control" id={f.id} aria-describedby={f.id} placeholder={`Enter ${f.des}`} />
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div class="form-group my-3 row">
                        <label for='photo' className='col-sm-2 text-end'>Upload Photo :</label>
                        <div className='col-sm-10'>
                            <input type='file' accept=".png, .jpg, .jpeg" name='photo' onChange={handlePhoto} class="form-control" id='photo' aria-describedby='photo' />
                        </div>
                    </div>
                    {
                        user.isadmin?
                            null
                        :
                            <>
                                <div class="form-group form-check my-3">
                                    <input type="checkbox" checked={user.isadmin} name="isadmin" onChange={handleCheck} class="form-check-input" id="admin" />
                                    <label class="form-check-label" for="admin">Make Admin</label>
                                </div>
                                <div class="form-group form-check my-3">
                                    <input type="checkbox" checked={user.ismember} name="ismember" onChange={handleCheck} class="form-check-input" id="member" />
                                    <label class="form-check-label" for="member">Make Member</label>
                                </div>
                            </>
                    }
                    <button type="submit" name="submit" id="submit" onClick={UpdateTeam} class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default TeamUpdate