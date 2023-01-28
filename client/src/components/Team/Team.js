import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import './Team.css';
import {Context} from '../../Context/Context';
import {SERVER_URL} from '../../EditableStuff/Config';

const TeamCard = React.lazy(() => import('./TeamCard'));

function Team() {
  const [ teams, setTeams] = useState([]);
  const [ archTeam, setArchTeam ] = useState(false);
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

  const { user,logged_in } = useContext(Context);
  const getTeamData = async() => {
    console.log('year',year);
    try{
      axios.get(`${SERVER_URL}/getTeam/${year}`)
      .then(data => {
        setTeams(data.data);
        setArchTeam(false);
      })
    }catch(err){
      console.log(err);
    }
  }

  const getArchTeamData = async() => {
    try{
      axios.get(`${SERVER_URL}/getArchTeam`)
      .then(data => {
        setTeams(data.data);
        setArchTeam(true);
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
  },[logged_in]);

  useEffect(()=>{
    getTeamData();
  },[year])

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
                <div className='col-12 col-md-4 col-lg-4 text-md-left'>
                  <h3>{archTeam && <span>Archieved</span>} Team Members</h3>
                </div>
                <div className='col-12 col-md-5 col-lg-6 text-lg-right'>
                  {
                    user?user.isadmin?
                      <div className='right-panel'>
                        {
                          archTeam?
                            <NavLink rel="noreferrer" className='btn btn-sm' onClick={getTeamData}>
                              Team
                            </NavLink>
                          :
                            <NavLink rel="noreferrer" className='btn btn-sm' onClick={getArchTeamData}>
                              Archived
                            </NavLink>
                        }
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
                
                <div className='right-panel col-12 col-md-3 col-lg-2'>
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