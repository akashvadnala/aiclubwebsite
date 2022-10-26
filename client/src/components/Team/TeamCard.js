import React from 'react';

function TeamCard({ src, name, title, text, email }) {
  return (
        <div className=' col-lg-3 col-md-4 col-sm-6 col-6'>
            <div className='card'>
              <img className='card-img-top' src={src} alt={name} />
              <div className='card-body'>
                <h5>{name}</h5>
                <h7>{title}</h7>
                <p>{text}</p>
                <a href={`mailto:${email}`} >{email}</a>
              </div>   
            </div>
        </div>
  )
}

export default TeamCard