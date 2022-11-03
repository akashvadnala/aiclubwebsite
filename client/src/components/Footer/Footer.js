import React from 'react';
import './Footer.css';

const Footer = () => {
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
            <h5>NEWSLETTER</h5> 
            <p>Subscribe to Newsletters and Stay informed about our news and events</p>
            <div><input /></div>
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