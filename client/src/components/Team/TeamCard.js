import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {SERVER_URL} from '../../EditableStuff/Config';

function TeamCard({ team, isadmin, isdelete }) {
  const navigate = useNavigate();
  const PostDelete = async (username) => {
    const res = await axios.delete(`${SERVER_URL}/team/delete/${username}`);
    if(res.status===200){
      
    }
    else if(res.status===201){
      navigate('/team');
    }
  }
  return (
        <div className=' col-lg-3 col-md-4 col-sm-6 col-6'>
            <div className='card'>
              <img className='card-img-top' src={team.photo} alt={team.firstname} />
              <div className='card-body'>
                <h5>{team.firstname} {team.lastname}</h5>
                <h7>{team.profession}</h7>
                <p>{team.description}</p>
                <a href={`mailto:${team.email}`} >{team.email}</a>
                {
                  isadmin?
                  <div className='admin-opt'>
                    <span>
                      <a href={`/team/edit/${team.username}`}>Edit </a>    
                    </span>
                    {
                      isdelete?
                        null
                      :
                        <>
                          ·
                          <span> 
                            <a href="#" onClick={PostDelete(team.username)}> Delete</a>
                          </span>
                        </>
                    }
                    
                  </div>
                  :
                  ''
                }
              </div>   
            </div>
        </div>
  )
}

export default TeamCard