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
    const [canDelete,setCanDelete] = useState(false);
    const [selectedImages,setSelectedImages] = useState([]);
    const [del, setDel] = useState(false);
    
    const getAllPhotos = async () => {
      try {
        let imagedata=[];
        const data = await axios.get(`${SERVER_URL}/gallery/getAllPhotos`);

        imagedata = data.data;
        // console.log("imagedata", imagedata);
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
        // console.log("photos ",photos);
      } catch (err) {
        console.log(err);
      }
    };

    const handleSelect =(e)  => {
      // e.preventDefault();
      const {value,checked} = e.target;
      if(checked){
        setSelectedImages([...selectedImages,value]);
      }else{
        const newList = selectedImages.filter((url)=>value!=url);
        setSelectedImages(newList);
      }
      console.log(selectedImages);
    }

    const handleDelete = async (e) => {
      e.preventDefault();
      setDel(true);
      try {
        const response = await axios.delete(
          `${SERVER_URL}/gallery/deleteImages`,
          {data:
            {urls:selectedImages}
          },
          {
            headers: { "Content-Type": "application/json" },
          });

        if (response.status === 422 || !response) {
          window.alert("Posting failed");
          console.log("Posting failed");
        } else {
          console.log("data");
          console.log(response);
          console.log("deleted Successfull");
          window.location.reload(true);
        }
      } catch (error) {
        console.log(error);
      }

    }

    useEffect(()=>{
      getAllPhotos();
    },[]);


    const renderPhoto = ({ layout, layoutOptions, imageProps: { alt, style, ...restImageProps } }) => (
      <div
          style={{
            border: "2px solid #eee",
            borderRadius: "4px",
            boxSizing: "content-box",
            alignItems: "center",
            width: style?.width,
            padding: `${layoutOptions.padding - 2}px`,
            paddingBottom: 0,
            // display:"flex",
          }}
      >
        {canDelete?(
          <div className="form-check">
            <input 
            className="form-check-input" 
            type="checkbox" value={restImageProps.src} 
            id="flexCheckDefault" 
            onChange={handleSelect}
            />
          </div>
        ):null}
        <img alt={alt} style={{ ...style, width: "100%", padding: 0 }} {...restImageProps} />
            
      </div>
    );

    return (
      <div className="gallery-container container">
          <div className="titlebox">
            <h4>All Images</h4>
              {user && user.isadmin ? (
                <div>
                  {canDelete ? (
                    <div>
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={()=>{
                          setSelectedImages([]);
                          setCanDelete(false)
                        }}
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        name="submit"
                        className="btn btn-danger ms-2"
                        onClick={handleDelete}
                      >
                        {del ? (
                          <>
                            <span>Deleting... </span>
                            <i className="fa fa-spinner fa-spin"></i>
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  ):(
                    <div>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={()=>setCanDelete(true)}
                      >
                        Enable Delete
                      </button>
                    </div>
                  )}
                  
                </div>
              ) : null}
          </div>
            
          <PhotoAlbum
            layout="rows"
            photos={photos}
            targetRowHeight={200}
            renderPhoto={renderPhoto}
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
        <br></br>
      </div>
    );
  };
  
  export default AllPhotos;
  
