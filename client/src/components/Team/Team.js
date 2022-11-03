import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import './Team.css';
import TeamCard from './TeamCard';

function Team() {
  const [ teams, setTeams] = useState([]);
  const getTeamData = async() => {
    try{
      const res = await fetch('/getTeam',{
        method:"GET",
        headers: {
          Accept: "application/json",
          "Content-Type":"application/json"
        }
      });
      const data = await res.json();
      setTeams(data);
      console.log(teams.length);
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
    getTeamData();
 });
  // const teams=[
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
              {/* <h4>Team Members</h4> */}
              <div className='row'>
                {
                  teams.map((team) => {
                    return(
                      <>
                        <TeamCard team={team} />
                      </>
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