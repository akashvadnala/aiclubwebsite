import React, { useEffect, useState } from 'react';
import Slider from './Slider/Slider';
import './Home.css';
import Activities from './Activities/Activities';
import PhotoGallery from './PhotoGallery/Gallery';
import Publications from './Publications/Publication';
import RecentBlogs from './RecentBlogs/RecentBlogs';
import axios from 'axios';
import { SERVER_URL } from '../../EditableStuff/Config';
import Loading from '../Loading';

const Home = () => {

  const [slides, setSlides] = useState(null);
  const [events, setEvents] = useState(null);
  const [projects, setProjects] = useState(null);
  const [publications, setPublicationList] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [load, setLoad] = useState(0);

  // console.log('slides',slides);
  // console.log('events',events);
  // console.log('projects',projects);
  // console.log('publications',publications);
  // console.log('blogs',blogs);
  // console.log('photos',photos);

  const getHome = async () => {
    try {
      //slides
      let getSlides, getEvents, getProjects, getPublications, getBlogs, getImages;
      axios.get(`${SERVER_URL}/getSlides`).then(data => { setSlides(data.data);setLoad(1) });
      axios.get(`${SERVER_URL}/events/gethomepageEvents`).then(data => { setEvents(data.data) });
      axios.get(`${SERVER_URL}/getfiveprojects`).then(data => { setProjects(data.data) });
      axios.get(`${SERVER_URL}/getResearchPapers`).then(data => { setPublicationList(data.data) });
      axios.get(`${SERVER_URL}/getsixBlogs`).then(data => { setBlogs(data.data) });
      axios.get(`${SERVER_URL}/gallery/getHomepagePhotos`).then(data => {
        let imagedata = [];
        imagedata = data.data;

        let photoArray = imagedata.map((photo, index) => {
          const width = photo.width * 4;
          const height = photo.height * 4;
          return {
            src: photo.imgurl,
            key: `${index}`,
            width,
            height,
            title: photo.caption,
          };
        });
        setPhotos(photoArray);
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getHome();
  }, []);
  return (
    <>
      {slides && <Slider slides={slides} />}
      {(events || projects) && <Activities events={events} projects={projects} />}
      {publications && <Publications publications={publications} />}
      {blogs && <RecentBlogs blogs={blogs} />}
      {photos && <PhotoGallery photos={photos} />}
      {load === 0 && <Loading />}
    </>
  )
}

export default Home