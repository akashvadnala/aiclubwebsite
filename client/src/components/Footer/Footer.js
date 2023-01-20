import React, { useState } from 'react';
import axios from 'axios';
import './Footer.css';
import { CLIENT_URL, SERVER_URL } from '../../EditableStuff/Config';

const Footer = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const addSubscriber = async (e) => {
    e.preventDefault();

    let data = {
      name:name,
      email:email
    }

    try{
      let status = await axios.post(`${SERVER_URL}/subscribe`,data);
      console.log(status);
    }catch(error){
      console.log(error);
    }
    setName('');
    setEmail('');
    return;
  }

  return (
    <div className='footer' id='contactus'>
      <div className='adjust'>
        <div className='row'>
          <div className='col-md-4 col-sm-12'>
            <h5>AI CLUB</h5>
            <p>Our Team</p>
            <p>Projects</p>
            <p>Blogs</p>
            <p>About</p>
          </div>
          <div className='col-md-4 col-sm-12'>
            <h5>CONTACT US</h5>
            <p>Address: <span>Central Computer Center, NIT Calicut, Kozhikode, Kerala - 673601</span></p>
            <p>Email: <span>aiclub@nitc.ac.in</span></p>
          </div>
          <div className='col-md-4 col-sm-12'>
            <h5>LATEST UPDATES</h5>
            <form method='POST' onSubmit={addSubscriber} encType="multipart/form-data">
              <p>Subscribe to Stay informed about our News, Events, Blogs and Projects</p>
              <input 
                style={{ height: "1.8rem", borderColor: 'black', borderWidth: "0.05rem", marginBottom:'0.1rem'}} 
                name='name' 
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder='Enter Name' 
                required/>
              <input 
                style={{ height: "1.8rem", borderColor: 'black', borderWidth: "0.05rem" }} 
                name='email' 
                value={email}
                placeholder='Enter Email' 
                onChange={(e)=>setEmail(e.target.value)}
                required/>
              <div className='py-1'><button type="submit" name="submit" id="submit" className='btn btn-success btn-sm'>Subscribe</button></div>
            </form>
          </div>
        </div>
        <div className='row text-centre'>
          <div className='col-xs-12'>
            <hr />
            Copyright © 2022 AI-CLUB NITC. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer