import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";

const TeamUpdate = () => {
    const navigate = useNavigate();
    const params = new useParams();
    const username = params.username;
    // console.log(username);
    const [user,setUser] = useState([]);
    const getUserDataForEdit = async () =>{
        try{
            const res = await fetch(`/getUserDataForEdit/${username}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            const data = await res.json();
            console.log('Data');
            console.log(data);
            setUser(data);
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
    
    const handlePhoto = (e) => {
        setUser({...user, photo: e.target.files[0]});
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
        // const res = await 
        fetch(`/teamupdate/${username}`,{
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            firstname,lastname,profession,description,username,photo,email,isadmin,ismember
        })
        }).then((data) =>{
            console.log(data);
            if(data.status===422 || !data){
                console.log('Username not found');
            }
            else{
                navigate('/team');
            }
        });
        
        // .then((data)=>{
        // if(data.status === 422 || !data){
        //     window.alert("Invalid Regsitration");
        //     console.log("Invalid Regsitration");
        // }
        // else{
        //     console.log(data);
        //     window.alert("Regsitration Successfull");
        //     console.log("Regsitration Successfull");
        //     navigate('/');
        // }
        // });
        // const data = await res.json();
        // if(data.status === 422 || !data){
        //   window.alert("Invalid Regsitration");
        //   console.log("Invalid Regsitration");
        // }
        // else{
        //   window.alert("Regsitration Successfull");
        //   console.log("Regsitration Successfull");
        //   history.push('/')
        // }
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
                    <div class="form-group form-check my-3">
                        <input type="checkbox" defaultChecked={user.isadmin} name="admin" onChange={handleInputs} class="form-check-input" id="admin" />
                        <label class="form-check-label" for="admin">Make Admin</label>
                    </div>
                    <div class="form-group form-check my-3">
                        <input type="checkbox" defaultChecked={user.ismember} name="member" onChange={handleInputs} class="form-check-input" id="member" />
                        <label class="form-check-label" for="member">Make Member</label>
                    </div>
                    <button type="submit" name="submit" id="submit" onClick={UpdateTeam} class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default TeamUpdate