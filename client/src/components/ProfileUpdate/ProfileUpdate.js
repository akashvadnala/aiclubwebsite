import React, {useState} from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const ProfileUpdate = () => {
    const { search } = useLocation();
    const username = new URLSearchParams(search).get("username");
    console.log(username);
    const navigate = useNavigate();
    const [user,setUser] = useState({
        firstname:"",
        lastname:"",
        profession:"",
        description:"",
        username:"",
        email:"",
        password:"",
        cpassword:"",
        isadmin:false,
        draft:true
    });
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        console.log(name);
        console.log(value);
        setUser({...user, [name]:value});
    }
    
    const PostTeam = async (e) => {
        e.preventDefault();
        console.log('Postteam');
        const {firstname,lastname,profession,description,username,email,password,cpassword} = user;
        console.log(firstname,lastname,profession,description,username,email,password,cpassword);
        // const res = await 
        fetch("/teamupdate",{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            firstname,lastname,profession,description,username,email,password,cpassword
        })
        })
        .then(res => {
        return res.json();
        })
        .then((data)=>{
        if(data.status === 422 || !data){
            window.alert("Invalid Regsitration");
            console.log("Invalid Regsitration");
        }
        else{
            console.log(data);
            window.alert("Regsitration Successfull");
            console.log("Regsitration Successfull");
            navigate('/');
        }
        });
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
            'type':'password',
            'id':'password',
            'des':'Password',
            'val':user.password
        },
        {
            'type':'password',
            'id':'cpassword',
            'des':'Confirm Password',
            'val':user.cpassword
        }
    ]
  return (
    <>
        <div className='profile-update-container'>
            <div className='profile-update adjust'>
                <h3>You are editing {username} profile</h3>
                <form method='POST'>
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
                    <div class="form-group form-check my-3">
                        <input type="checkbox" name="admin" onChange={handleInputs} class="form-check-input" id="admin" />
                        <label class="form-check-label" for="admin">Make Admin</label>
                    </div>
                    <div class="form-group form-check my-3">
                        <input type="checkbox" name="member" onChange={handleInputs} class="form-check-input" id="member" />
                        <label class="form-check-label" for="member">Make Member</label>
                    </div>
                    <button type="submit" name="submit" id="submit" onClick={PostTeam} class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default ProfileUpdate