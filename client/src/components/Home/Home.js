import React from 'react';
import Slider from './Slider/Slider';
import Module from './Module/Module';
import './Home.css';
import Activities from './Activities/Activities';
import ProjectsHome from './ProjectsHome/ProjectsHome';

const Home = () => {
  return (
    <>
      <Slider />
      {/* <Module /> */}
      <ProjectsHome />
      <Activities />
    </>
  )
}

export default Home