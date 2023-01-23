import * as React from "react";

import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import photos from "./photos";
import './gallery.css';

const PhotoGallery = () => {
    const [index, setIndex] = React.useState(-1);
  
    return (
      <div className="gallery-container adjust">
        <h4>Image Gallery</h4>
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
  
  export default PhotoGallery;
  
