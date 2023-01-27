import axios from 'axios';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import './Team.css';
import {Context} from '../../Context/Context';
import {SERVER_URL} from '../../EditableStuff/Config';

const TeamCard = React.lazy(() => import('./TeamCard'));

function Team() {
  const [ teams, setTeams] = useState([]);
  const [ archTeam, setArchTeam ] = useState(false);
  const [ teamHeading, setTeamHeading ] = useState('Team Members');
  const [ archStat, setArchStat ] = useState('Archived');
  const [ msg, setMsg ] = useState();

  const d=new Date();
  var y=d.getFullYear();
  const ly=2019;
  const years = Array.from(
  {length:y-ly+1},
  (value,index)=>{
    return(ly+index);
  });
  years.reverse();
  const [ year, setYear ] = useState(y+1);

  const { user } = useContext(Context);
  const getTeamData = async() => {
    console.log('year',year);
    try{
      axios.get(`${SERVER_URL}/getTeam/${year}`)
      .then(data => {
        console.log('data');
        console.log(data.data);
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
      axios.get(`${SERVER_URL}/getArchTeam`)
      .then(data => {
        console.log('data');
        console.log(data.data);
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
  },[year]);

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

  const PostDelete = async (username) => {
    const res = await axios.post(`${SERVER_URL}/team/delete/${username}`);
    if(res.status===200){
      console.log('User not deleted');
    }
    else if(res.status===201){
      // navigate('/team');
      setTeams(Team.filter((item) => item.username !== username));
    }
  }
  return (
    <>
    <Helmet>
      <title>Team - AI Club</title>
    </Helmet>
      <div className='team-container'>
        <div className='head-img'>
          <h1>Team Members</h1>
          {/* <img src='https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png' /> */}
        </div>
          <div className='container team'>
              <div className='row align-items-center'>
                <div className='col-12 col-md-4'>
                  <h3>{teamHeading}</h3>
                </div>
                <div className='col-12 col-md-4'>
                  {
                    user?user.isadmin?
                      <div className='right-panel'>
                        <NavLink rel="noreferrer" className='btn btn-sm' onClick={toggleArchived}>{archStat}</NavLink>
                        <NavLink className='btn btn-sm btn-primary' to='/team/add'>
                          <span><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-plus-circle-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                          </svg></span>
                          {' '}Add
                      </NavLink>
                      </div>
                    :'':''
                  }
                </div>
                
                <div className='right-panel col-12 col-md-4'>
                  <select name="year" value={year} onChange={(e)=>setYear(e.target.value)} className="form-select" aria-label="year">
                    {/* <option value="">Select Year</option> */}
                      <option value={y+1}>Present</option>
                    {/* <option value={year}>Present</option> */}
                    {
                      years.map((yr)=>{
                        return(<option value={yr}>{yr}</option>)
                      })
                    }
                  </select>
                </div>
              </div>
              <div className='msg'>
                {
                  msg?
                  <span>{msg}</span>
                  :
                  null
                }
              </div>
              {/* <h4>Team Members</h4> */}
              <div className='row'>
                  {
                    teams.map(team => {
                      return(
                        <TeamCard team={team} isadmin={user?user.isadmin:false} isdelete={user?user.username===team.username:false}/>
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