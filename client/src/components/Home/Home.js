import React from 'react';
import Slider from './Slider/Slider';
import Module from './Module/Module';
import './Home.css';
import Activities from './Activities/Activities';
import PhotoGallery from './PhotoGallery/Gallery';

const Home = () => {
  return (
    <>
      <Slider />
      {/* <Module /> */}
      <Activities />
      <PhotoGallery />
    </>
  )
}

export default Home