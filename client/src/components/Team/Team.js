import React from 'react';
import './Team.css';
import TeamCard from './TeamCard';

function Team() {
  const teams=[
    {
      'imgsrc':'https://aiclub.nitc.ac.in/img/drive/jayaraj%20sir.jpg',
      'text':'Assistant Professor at NIT Calicut CSED',
      'name':'Jayaraj PB',
      'title':'Faculty Advisor',
      'email':'jayarajpb@nitc.ac.in'
    },
    {
      'imgsrc':'https://aiclub.nitc.ac.in/img/drive/pournamimam.jpg',
      'text':'Assistant Professor at NIT Calicut CSED',
      'name':'Dr. Pournami P.N.',
      'title':'Faculty Advisor',
      'email':'pournamipn@nitc.ac.in'
    },
    {
      'imgsrc':'https://aiclub.nitc.ac.in/img/drive/BHANUPRAKASH%20PEBBETI.jpeg',
      'text':'Assistant Professor at NIT Calicut CSED',
      'name':'Bhanu Prakash Pebbeti',
      'title':'Secretary',
      'email':'pebbetibhanu2017@gmail.com'
    }
  ]
  return (
      <div className='team-container'>
        <div className='head-img'>
          <h1>Team Members</h1>
          {/* <img src='https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png' /> */}
        </div>
          <div className='team adjust'>
              {/* <h4>Team Members</h4> */}
              <div className='row'>
                {
                  teams.map((team)=>{
                    return(
                      <TeamCard src={team.imgsrc} text={team.text} name={team.name} title={Team.title} email={teams.email}/>
                    )
                  })
                }
              </div>
          </div>
      </div>
  )
}

export default Team