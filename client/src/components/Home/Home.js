import React from 'react';
import Slider from './Slider/Slider';
import './Home.css';
import Activities from './Activities/Activities';
import PhotoGallery from './PhotoGallery/Gallery';

const Home = () => {
  return (
    <>
      <Slider />
      <Activities />
      <PhotoGallery />
    </>
  )
}

export default Home