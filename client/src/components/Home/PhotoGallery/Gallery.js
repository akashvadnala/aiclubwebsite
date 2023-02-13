import React from "react";
import { useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "./gallery.css";
import { NavLink } from "react-router-dom";

const PhotoGallery = ({photos}) => {
  const [index, setIndex] = useState(-1);
  // const [photos, setPhotos] = useState([]);

  // const getHomePhotos = async () => {
  //   try {
  //     let imagedata = [];
  //     const data = await axios.get(`${SERVER_URL}/gallery/getHomepagePhotos`);

  //     imagedata = data.data;
  //     // console.log("imagedata", imagedata);

  //     let photoArray = imagedata.map((photo, index) => {
  //       const width = photo.width * 4;
  //       const height = photo.height * 4;
  //       return {
  //         src: photo.imgurl,
  //         key: `${index}`,
  //         width,
  //         height,
  //         title: photo.caption,
  //       };
  //     });
  //     setPhotos(photoArray);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   getHomePhotos();
  // }, []);

  return (
    <div className="gallery-container py-5 adjust">
      <h3 className="pb-3 text-center">Image Gallery</h3>
      <PhotoAlbum
        layout="rows"
        photos={photos}
        targetRowHeight={200}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        styles={{ container: { backgroundColor: "rgba(240,240,240,.9)" } }}
        className="lightbox"
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos}
        plugins={[Captions]}
      />
      <div className="mt-3">
        <NavLink to="/gallery">
          View all Images<span className="small"> ❯</span>
        </NavLink>
      </div>
    </div>
  );
};

export default PhotoGallery;
