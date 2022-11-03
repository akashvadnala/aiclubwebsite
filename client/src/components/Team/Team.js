import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import './Team.css';
import TeamCard from './TeamCard';

function Team() {
  const [ teams, setTeams] = useState([]);
  const [ archTeam, setArchTeam ] = useState(false);
  const [ teamHeading, setTeamHeading ] = useState('Team Members');
  const [ archStat, setArchStat ] = useState('Archived');

  const getTeamData = async() => {
    try{
      axios.get('http://localhost:5000/getTeam')
      .then(data => {
        console.log('data');
        console.log(data.data[0].firstname);
        setTeams(data.data);
        setTeamHeading('Team Members');
        setArchTeam(false);
        setArchStat('Archived');
      })
    }catch(err){
      console.log(err);
    }
  }

  const getArchTeamData = async() => {
    try{
      axios.get('http://localhost:5000/getArchTeam')
      .then(data => {
        console.log('data');
        console.log(data.data[0].firstname);
        setTeams(data.data);
        setTeamHeading('Archived Team Members');
        setArchTeam(true);
        setArchStat('Team');
      })
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    if(archTeam){
        getArchTeamData();
    }
    else{
        getTeamData();
    }
  },[]);

   const toggleArchived = () =>{
    if(archTeam){
      getTeamData();
    }
    else{
      getArchTeamData();
    }
   } 
  //  const teams=[
  //   {
  //     'imgsrc':'https://aiclub.nitc.ac.in/img/drive/jayaraj%20sir.jpg',
  //     'text':'Assistant Professor at NIT Calicut CSED',
  //     'name':'Jayaraj PB',
  //     'title':'Faculty Advisor',
  //     'email':'jayarajpb@nitc.ac.in',
  //     'username':'jayrajpb',
  //     'show':true,
  //     'isadmin':false
  //   },
  //   {
  //     'imgsrc':'https://aiclub.nitc.ac.in/img/drive/pournamimam.jpg',
  //     'text':'Assistant Professor at NIT Calicut CSED',
  //     'name':'Dr. Pournami P.N.',
  //     'title':'Faculty Advisor',
  //     'email':'pournamipn@nitc.ac.in',
  //     'username':'pournamipn',
  //     'show':true,
  //     'isadmin':false
  //   },
  //   {
  //     'imgsrc':'https://aiclub.nitc.ac.in/img/drive/BHANUPRAKASH%20PEBBETI.jpeg',
  //     'text':'Assistant Professor at NIT Calicut CSED',
  //     'name':'Bhanu Prakash Pebbeti',
  //     'title':'Secretary',
  //     'email':'pebbetibhanu2017@gmail.com',
  //     'username':'bhanu',
  //     'show':true,
  //     'isadmin':true
  //   }
  // ]
  return (
    <>
    <Helmet>
      <title>TEAM - AI CLUB - NITC</title>
    </Helmet>
      <div className='team-container'>
        <div className='head-img'>
          <h1>Team Members</h1>
          {/* <img src='https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png' /> */}
        </div>
          <div className='team adjust'>
              <div className='row'>
                <div className='col-sm-5'>
                  <h2>{teamHeading}</h2>
                </div>
                <div className='right-panel col-sm-7'>
                  <NavLink className='teamadd' onClick={toggleArchived}>{archStat}</NavLink>
                  <NavLink className='teamadd' to='/team/add'>Add +</NavLink>
                </div>
              </div>
              
              {/* <h4>Team Members</h4> */}
              <div className='row'>
                {
                  teams.map(team => {
                    return(
                      <TeamCard team={team} />
                    )
                  })
                }
              </div>
          </div>
      </div>
  </>
  )
}

export default Team