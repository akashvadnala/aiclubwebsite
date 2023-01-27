import React from 'react';
import Slider from './Slider/Slider';
import Module from './Module/Module';
import './Home.css';
import Activities from './Activities/Activities';
import PhotoGallery from './PhotoGallery/Gallery';
import Publications from './Publications/Publication';
import RecentBlogs from './RecentBlogs/RecentBlogs';

const Home = () => {
  return (
    <>
      <Slider />
      {/* <Module /> */}
      <Activities />
      <Publications />
      <RecentBlogs />
      <PhotoGallery />
    </>
  )
}

export default Home