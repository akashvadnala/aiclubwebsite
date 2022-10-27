import React from 'react';
import {islogin,user} from '../../EditableStuff/Config';

function TeamCard({ team }) {
  return (
        <div className=' col-lg-3 col-md-4 col-sm-6 col-6'>
            <div className='card'>
              <img className='card-img-top' src={team.imgsrc} alt={team.name} />
              <div className='card-body'>
                <h5>{team.name}</h5>
                <h7>{team.title}</h7>
                <p>{team.text}</p>
                <a href={`mailto:${team.email}`} >{team.email}</a>
                {
                  islogin?
                    user.isadmin?
                    <div className='admin-opt'>
                      <span>
                        <a href={`/edit?username=${team.username}`}>Edit</a>    
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