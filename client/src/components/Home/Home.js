import React from 'react';
import Slider from './Slider/Slider';
import './Home.css';
import Activities from './Activities/Activities';

const Home = () => {
  return (
    <div>
      <Slider />
      <Activities />
    </div>
  )
}

export default Home