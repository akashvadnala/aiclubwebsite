import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeamAdd = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState({
        firstname:"",
        lastname:"",
        profession:"",
        description:"",
        username:"",
        email:"",
        year:"",
        photo:"",
        password:"",
        cpassword:"",
        isadmin:false,
        ismember:false
    });
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({...user, [name]:value});
    }
    const handlePhoto = (e) => {
        console.log('photo name',e.target.name);
        setUser({...user, [e.target.name]: e.target.files[0]});
        console.log('photo');
        console.log(e.target.files[0]);
        console.log('User');
        console.log(user);
    }
    const handleCheck = (e) =>{
        setUser({...user, [e.target.name] : e.target.checked});
    }

    
    const PostTeam = async (e) => {
        e.preventDefault();
        console.log('Postteam');
        const {firstname,lastname,profession,description,username,email,year,photo,password,cpassword,isadmin,ismember} = user;
        console.log(firstname,lastname,profession,description,username,email,year,photo,password,cpassword,isadmin,ismember);
        console.log('photo',photo);

        const data = new FormData();
        const photoname = Date.now() + photo.name;
        data.append("name",photoname);
        data.append("photo",photo);
        var imgurl;

        try{
            const img = await axios.post('http://localhost:5000/imgupload',data);
            console.log('img',img);
            imgurl = img.data;
        }catch(err){
            console.log('photoerr',err);
        }
           console.log('imgurl',imgurl);
        
        try{
            const teamdata = await axios.post('http://localhost:5000/teamadd',
                {
                    'firstname':firstname,
                    'lastname':lastname,
                    'profession':profession,
                    'description':description,
                    'username':username,
                    'email':email,
                    'year':year,
                    'photo':imgurl,
                    'password':password,
                    'cpassword':cpassword,
                    'isadmin':isadmin,
                    'ismember':ismember
                },
                {
                    headers:{"Content-Type" : "application/json"}
                }
            );
            console.log('teamdata',teamdata);
            if(teamdata.status === 422 || !teamdata){
                window.alert("Invalid Regsitration");
                console.log("Invalid Regsitration");
            }
            else{
                console.log('data');
                console.log(teamdata);
                console.log("Regsitration Successfull");
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
                <h1>Add Team Member</h1>
                <form onSubmit={PostTeam} method="POST" encType="multipart/form-data">
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
                            <input type='file' accept="image/*" name="photo" onChange={handlePhoto} class="form-control" id='photo' aria-describedby='photo' />
                        </div>
                    </div>
                    <div class="form-group form-check my-3">
                        <input type="checkbox" checked={user.isadmin} name="isadmin" onChange={handleCheck} class="form-check-input" id="admin" />
                        <label class="form-check-label" for="admin">Make Admin</label>
                    </div>
                    <div class="form-group form-check my-3">
                        <input type="checkbox" checked={user.ismember} name="ismember" onChange={handleCheck} class="form-check-input" id="member" />
                        <label class="form-check-label" for="member">Make Member</label>
                    </div>
                    <button type="submit" name="submit" id="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default TeamAdd;