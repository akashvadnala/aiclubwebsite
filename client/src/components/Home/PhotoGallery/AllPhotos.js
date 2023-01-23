import React from "react";
import { useContext, useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import './gallery.css';
import { Context } from "../../../Context/Context";
import {  SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
// import { getImageSize } from 'react-image-size';

const AllPhotos = () => {
    const { user } = useContext(Context);
    const [index, setIndex] = useState(-1);
    const [photos,setPhotos]=useState([]);

    const getAllPhotos = async () => {
      try {
        let imagedata=[];
        const data = await axios.get(`${SERVER_URL}/gallery/getAllPhotos`);

        imagedata = data.data;
        console.log("imagedata", imagedata);
        let photoArray = imagedata.map((photo, index) => {
          const width = photo.width * 4;
          const height = photo.height * 4;
          return ({
            src: photo.imgurl,
            key: `${index}`,
            width,
            height,
            title:photo.caption,
          })
        });
        setPhotos(photoArray);
        console.log("photos ",photos);
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(()=>{
      getAllPhotos();
    },[]);

    return (
      <div className="gallery-container adjust">
        <div className="titlebox">
          <h4>All Images</h4>
            {/* {user && user.isadmin ? (
              <button type="button" class="btn btn-primary btn-rounded btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Add Images
              </button>
            ) : null} */}
        </div>

        <PhotoAlbum
          layout="rows"
          photos={photos}
          targetRowHeight={200}
          onClick={({ index }) => setIndex(index)}
        />
  
        <Lightbox
          styles={{ container: { backgroundColor: "rgba(240,240,240,.9)" } }}
          className = 'lightbox'
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={photos}
          plugins={[Captions]}
        />
      </div>
    );
  };
  
  export default AllPhotos;
  
