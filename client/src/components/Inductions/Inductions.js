import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Inductions.css';
import Overview from './Overview';
import Data from './Data';
import Leaderboard from './Leaderboard';
import Register from './Register';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Inductions = () => {
    
  const [key, setKey] = useState('home');
  return (
    <div className='inductions-container'>
        <div className='adjust'>
            {/* <InductionsHeader />
            <div className='inductions-body'>
                This is Overview Section
            </div> */}
            <h2>Inductions B20-B21</h2>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <a href="#pills-overview" className="nav-link active" id="pills-overview-tab" data-bs-toggle="pill" data-bs-target="#pills-overview" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Overview</a>
              </li>
              <li className="nav-item" role="presentation">
                <a href="#pills-data" className="nav-link" id="pills-data-tab" data-bs-toggle="pill" data-bs-target="#pills-data" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Data</a>
              </li>
              <li className="nav-item" role="presentation">
                <a href="#pills-leaderboard" className="nav-link" id="pills-leaderboard-tab" data-bs-toggle="pill" data-bs-target="#pills-leaderboard" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Leaderboard</a>
              </li>
              <li className="nav-item" role="presentation">
                <a href="#pills-register" className="nav-link" id="pills-register-tab" data-bs-toggle="pill" data-bs-target="#pills-register" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Register</a>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div className="tab-pane fade show active" id="pills-overview" role="tabpanel" aria-labelledby="pills-overview-tab"><Overview /></div>
              <div className="tab-pane fade" id="pills-data" role="tabpanel" aria-labelledby="pills-data-tab"><Data /></div>
              <div className="tab-pane fade" id="pills-leaderboard" role="tabpanel" aria-labelledby="pills-leaderboard-tab"><Leaderboard /></div>
              <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="pills-register-tab"><Register /></div>
            </div>
          {/* <NavLink to="#contact-us">Contact Us</NavLink> */}
          {/* <NavLink to="/inductions-b21-b20/data">Data</NavLink>
          
          <NavLink to="/inductions-b21-b20/register">Register</NavLink> */}
          {/* <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="home" title="Home">
              <Overview />
            </Tab>
            <Tab eventKey="profile" title="Profile">
              <Data />
            </Tab>
            <Tab eventKey="contact" title="Contact">
              <Leaderboard />
            </Tab>
          </Tabs> */}
        </div>
    </div>
  )
}

export default Inductions