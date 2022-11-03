import React from 'react';
import {islogin,user} from '../../EditableStuff/Config';

function TeamCard({ team }) {
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
                  islogin?
                    user.isadmin?
                    <div className='admin-opt'>
                      <span>
                        <a href={`/team/edit/${team.username}`}>Edit</a>    
                     </span>
                      ·
                      <span> Delete</span>
                    </div>
                    :
                    ''
                  :
                  ''
                }
              </div>   
            </div>
        </div>
  )
}

export default TeamCard