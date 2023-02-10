import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../EditableStuff/Config';
import CompeteLogin from '../Navbar/CompeteLogin';

const InductionsHeader = ({props}) => {
  console.log('props',props);
  const location = useLocation();
  const [isJoined,setIsJoined] = useState(false);
  

  let keys = {
    '':'Overview',
    'data':'Data',
    'leaderboard':'Leaderboard',
    'rules':'Rules',
  }
  if(props.access){
    keys = {
      'host':'Host',
      '':'Overview',
      'data':'Data',
      'leaderboard':'Leaderboard',
      'rules':'Rules',
    }
  }
  if(isJoined){
    keys = {
      '':'Overview',
      'data':'Data',
      'leaderboard':'Leaderboard',
      'rules':'Rules',
      'submissions':'Submissions',
    }
  }
  if(props.access && isJoined){
    keys = {
      'host':'Host',
      '':'Overview',
      'data':'Data',
      'leaderboard':'Leaderboard',
      'rules':'Rules',
      'submissions':'Submissions',
    }
  }
  const [modalShow2, setModalShow2] = useState(false);
  const [joining,setJoining] = useState(false);
  const joinCompete = async () => {
    try{
      if(props.username){
        setJoining(true);
        axios.post(`${SERVER_URL}/joinCompete`,
        {
          url:props.c.url,
          username:props.username
        })
        .then(res=>{
          if(res.status===200){
            window.location.reload(true);
          }
        })
      }
      else{
        localStorage.setItem('aiclubnitcsignupredirect',location.pathname);                             
        setModalShow2(true);
      }
    }catch(err){
      console.log(err);
    }
  }  
  useEffect(()=>{
    setIsJoined(props.isJoined);
  },[props]);
  return (
    <>
        <div className='row'>
          <div className='col-md-9'><h3>{props.c.title}</h3></div>
          <div className='col-md-3 text-end'>
            <div>
              {
                isJoined?
                <button className="btn btn-sm btn-outline-success"><i className="fas fa-check-circle green"></i> Joined</button>
                :
                <NavLink className="btn btn-sm btn-outline-black" onClick={joinCompete}>
                  {
                    joining?
                      <>
                        <span>Joining </span> 
                        <i className="fa fa-spinner fa-spin"></i>
                      </>
                    :
                      <>Join Competition</>
                  }
                </NavLink>
              }
              
            </div>
          </div>
        </div>
        <p>{props.c.description}</p>
        <div className='inductions-navbar align-items-center border-bottom'>
            {
              Object.entries(keys).map(([key, value]) => {
                return(
                  <div><NavLink to={`/competitions/${props.c.url}/${key}`}>{value}</NavLink></div>
                )
              })
            }
        </div>
        <CompeteLogin
            compete={props.c.url}
            show={modalShow2}
            onHide={() => setModalShow2(false)}
        />
    </>
  )
}

export default InductionsHeader