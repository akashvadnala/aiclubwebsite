import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import { SERVER_URL } from '../../EditableStuff/Config';
import './Navbar.css';

const CompeteSignup = () => {
    const navigate = useNavigate();
    const [ team, setTeam ] = useState({
        firstname:"",
        lastname:"",
        username:"",
        email:"",
        password:"",
    })
    const [cpassword,setCPassword] = useState("");
    const [ otp ,setOpt] = useState("");
    const handleInput = (e) => {
        setTeam({...team,[e.target.name]:e.target.value});
    }
    const CreateAccount = (e) =>{
        e.preventDefault();
        if(cpassword===team.password){
            try{
                axios.post(`${SERVER_URL}/competesignup`,
                team,
                {
                    headers:{"Content-Type" : "application/json"}
                })
                .then(res=>{
                    if(res.status===200){
                        console.log('Account Created Successfully');
                        navigate('/');
                    }
                    else{
                        console.log('Cannot Create Account');
                    }
                })
            }catch(err){
                console.log(err);
            }
        }
        else{
            console.log('Passwords not matched');
        }
        
    }
    return (
        <>
        <div className='competesignup-container container py-5'>
            <h2 className='pb-4'>Create Account <span className='h4'>(Competition)</span></h2>
            <div className='compete-signup text-center'>
            <form method="POST" onSubmit={CreateAccount} encType="multipart/form-data">
                <div className="row mb-4">
                    <div className="col">
                    <div className="form-outline">
                        <input type="text" name="firstname" value={team.firstname} onChange={handleInput} className="form-control form-control-lg" placeholder='First Name' required/>
                        {/* <label className="form-label">First Name</label> */}
                    </div>
                    </div>
                    <div className="col">
                    <div className="form-outline">
                        <input type="text" name="lastname" value={team.lastname} onChange={handleInput} className="form-control form-control-lg" placeholder='Last Name'/>
                        {/* <label className="form-label">Last Name</label> */}
                    </div>
                    </div>
                </div>

                <div className="form-outline mb-4">
                    <input type="email" name="email" value={team.email} onChange={handleInput} className="form-control form-control-lg" placeholder='Email Address' required/>
                    {/* <label className="form-label">Email Address</label> */}
                </div>

                <div className="form-outline mb-4">
                    <input type="text" name="username" value={team.username} onChange={handleInput} className="form-control form-control-lg" placeholder='Username' required/>
                    {/* <label className="form-label">Username</label> */}
                </div>

                <div className="form-outline mb-4">
                    <input type="password" name="password" value={team.password} onChange={handleInput} className="form-control form-control-lg" placeholder='Password' required/>
                    {/* <label className="form-label">Password</label> */}
                </div>  
 
                <div className="form-outline mb-4">
                    <input type="password" name="cpassword" value={cpassword} onChange={(e)=>{setCPassword(e.target.value)}} className="form-control form-control-lg" placeholder='Confirm Password' required/>
                    {/* <label className="form-label">Confirm Password</label> */}
                </div> 

                <div className="row mb-4 align-middle">
                    <div className="col-3">
                        <button type="reset" className="btn btn-secondary">Send OTP</button>
                    </div>
                    <div className="col-9">
                    <div className="form-outline">
                        <input type="text" name="otp" value={otp} onChange={(e)=>setOpt(e.target.value)} className="form-control form-control-lg" placeholder='Enter OTP'/>
                        {/* <label className="form-label">Enter OTP</label> */}
                    </div>
                    </div>
                </div>

                <div className="form-check d-flex justify-content-center mb-4">
                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example33" checked />
                    <label className="form-check-label" for="form2Example33">
                    Subscribe to our newsletter
                    </label>
                </div>

                <button type="submit" className="btn btn-primary">Sign up</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default CompeteSignup