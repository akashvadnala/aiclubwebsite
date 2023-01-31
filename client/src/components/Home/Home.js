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
      getSlides = await axios.get(`${SERVER_URL}/getSlides`)
      if (getSlides.status === 200) {
        setSlides(getSlides.data);
        //events
        getEvents = await axios.get(`${SERVER_URL}/events/gethomepageEvents`);
        if (getEvents.status === 200) {
          setEvents(getEvents.data);
          //projects
          getProjects = await axios.get(`${SERVER_URL}/getfiveprojects`);
          if (getProjects.status === 200) {
            setProjects(getProjects.data);
            //publications
            getPublications = await axios.get(`${SERVER_URL}/getResearchPapers`)
            if (getPublications.status === 200) {
              setPublicationList(getPublications.data);
              //blogs
              getBlogs = await axios.get(`${SERVER_URL}/getsixBlogs`)
              if (getBlogs.status === 200) {
                setBlogs(getBlogs.data);
                //images
                let imagedata = [];
                getImages = await axios.get(`${SERVER_URL}/gallery/getHomepagePhotos`);
                if (getImages.status === 200) {
                  imagedata = getImages.data;

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
                  setLoad(1);
                }

              }
            }
          }
        }
      }

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