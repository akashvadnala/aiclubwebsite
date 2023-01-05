import React from 'react'
import './ProfileCard.css'

const ProfileCard = (props) => {
  
  const addDefaultSrc=(ev)=>{
    ev.target.src = 'https://i.imgur.com/wvxPV9S.png'
  }

  return (
    <div className='ProfileCard'>
      <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
          <div className="card p-4">
            <div className=" image d-flex flex-column justify-content-center align-items-center">
              <button className="btn">
                <img onError={addDefaultSrc} className="rounded-circle"
                  src={!props.a.photo?"https://i.imgur.com/wvxPV9S.png":props.a.photo}
                  alt="profile"
                  height="120"
                  width="120"
                />
              </button>
              <span className="name mt-3">{props.a.firstname} {props.a.lastname}</span>
              <div className="text mt-3">
                <span>
                  {props.a.description}{" "}
                </span>
              </div>{" "}
              <div className=" px-2 rounded mt-4 date ">
                <span className="join" onClick={() => window.location = `mailto:${props.a.email}`}>Contact : <i className="fa fa-envelope"></i></span>
              </div>
            </div>
          </div>
        </div>
        </div>
  )
}

export default ProfileCard
