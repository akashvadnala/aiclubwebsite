import React, { useContext, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import './Footer.css';
import { CLIENT_URL, SERVER_URL } from '../../EditableStuff/Config';
import {alertContext} from "../../Context/Alert";

const Footer = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { showAlert } = useContext(alertContext);

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
    showAlert("Subscribed Successfully","success");
    setName('');
    setEmail('');
    return;
  }

  return (
    <div className='footer' id='contactus'>
      <div className='adjust'>
        <div className='row'>
          <div className='col-md-2 col-sm-12'>
            <h5>AI CLUB</h5>
            <NavLink to="/team" style={{color:"#212529"}}><p>Our Team</p></NavLink>
            <NavLink to="/projects" style={{color:"#212529"}}><p>Projects</p></NavLink>
            <NavLink to="/blogs" style={{color:"#212529"}}><p>Blogs</p></NavLink>
            <NavLink to="/events" style={{color:"#212529"}}><p>Events</p></NavLink>
          </div>
          <div className='col-md-2 col-sm-12'>
            <h5>&nbsp;&nbsp;</h5>
            <NavLink to="/gallery" style={{color:"#212529"}}><p>Gallery</p></NavLink>
            <NavLink to="/about" style={{color:"#212529"}}><p>About</p></NavLink>
          </div>
          <div className='col-md-4 col-sm-12'>
            <h5>CONTACT US</h5>
            <p>Address: <span>Central Computer Center, NIT Calicut, Kozhikode, Kerala - 673601</span></p>
            <div className="d-flex justify-content-start my-4">
            <a
              className="fas fa-envelope fa-lg mx-2"
              style={{ color: "#55acee" }}
              href={`mailto:aiclub@nitc.ac.in`}
            ></a>
            <a
              className="fab fa-linkedin-in fa-lg mx-2"
              style={{ color: "#3b5998" }}
              href="https://in.linkedin.com/company/ai-club-nitc"
              target = "_blank"
            ></a>
            <a
              className="fab fa-github fa-lg mx-2"
              style={{ color: "#333333" }}
              href="https://github.com/AI-Club-at-NITC"
              target = "_blank"
            ></a>
          </div>
          </div>
          <div className='col-md-4 col-sm-12'>
            <h5>LATEST UPDATES</h5>
            <form method='POST' onSubmit={addSubscriber} encType="multipart/form-data">
              <p>Subscribe to Stay informed about our News, Events, Blogs and Projects</p>
              {/* <input 
                style={{ height: "1.8rem", border: "1px solid #bdb7b7", borderWidth: "0.05rem", marginBottom:'0.1rem'}} 
                name='name' 
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder='Enter Name' 
                required/> */}
                <div class="input-group mb-3 align-items-center">
                  <input 
                    className='form-control'
                    name='email' 
                    value={email}
                    placeholder='Enter Email' 
                    onChange={(e)=>setEmail(e.target.value)}
                    required/>
                  <div class="input-group-append">
                    <button type="submit" name="submit" id="submit" className='btn btn-primary input-group-text rounded-right'>Subscribe</button>
                  </div>
                </div>
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