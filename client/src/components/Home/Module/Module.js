import React from 'react';
import { NavLink } from 'react-router-dom';
import './Module.css';

const Module = () => {
  return (
    <>
      <div className='module-container text-center'>
        <div className='module pb-2'>
          <img className='d-block w-100' src="https://i2.wp.com/myblogs.pw/wp-content/uploads/2018/08/AI-Web.jpg?fit=1034%2C480&ssl=1" />
          <div className='module-caption'>
            <h1>Inductions for B20 and B21</h1>
            <h6>For Students of Batch B20 and B21, who want to join AI Club</h6>
            <NavLink className="mt-3 btn align-items-center" to="competitions/ai-club-inductions">Know More <span>❯</span></NavLink>
          </div>
        </div>
        <div className='module pb-2'>
          <img className='d-block w-100' src="https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png" />
          <div className='module-caption'>
            <h1>Convoltional Neural Network</h1>
            {/* <h6>For Students of Batch B20 and B21, who want to join AI Club</h6> */}
            <NavLink className="mt-3 btn align-items-center" to="projects/cnn">Learn More <span>❯</span></NavLink>
          </div>
        </div>
      </div>
      <div className='row module2'>
      <div className='col-md-6 module-left'>
          <div className='module pb-2'>
            <img className='d-block w-100' src="https://media.istockphoto.com/photos/artificial-intelligence-concept-picture-id1364859722?b=1&k=20&m=1364859722&s=170667a&w=0&h=o7emaeAZHOvBP1_o5ewQH9y9279rQWS9xO_xU4r-u-4=" />
            <div className='module-caption'>
              <h1>Artificial Neural Network</h1>
              <NavLink className="mt-3 btn align-items-center" to="blogs/ann">Learn More <span>❯</span></NavLink>
            </div>
          </div>
        </div>
        <div className='col-md-6 module-right'>
          <div className='module pb-2'>
            <img className='d-block w-100' src="https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png" />
            <div className='module-caption'>
              <h1>Convoltional Neural Network</h1>
              <NavLink className="mt-3 btn align-items-center" to="projects/cnn">Learn More <span>❯</span></NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Module;