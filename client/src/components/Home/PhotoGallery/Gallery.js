import React from "react";
import { useContext, useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "./gallery.css";
import { Context } from "../../../Context/Context";
import { SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import { getImageSize } from "react-image-size";
import { NavLink } from "react-router-dom";

const PhotoGallery = () => {
  const { user } = useContext(Context);
  const [index, setIndex] = useState(-1);
  const [image, setImage] = useState();
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState([]);
  const [add, setAdd] = useState(false);

  const handlePhoto = (e) => {
    setImage(e.target.files[0]);
  };

  const postImage = async (e) => {
    e.preventDefault();
    setAdd(true);
    const data = new FormData();
    const photoname = Date.now() + image.name;
    data.append("name", photoname);
    data.append("photo", image);
    let imageurl;
    try {
      const img = await axios.post(`${SERVER_URL}/imgupload`, data);
      imageurl = img.data;
      console.log("final image", imageurl);
    } catch (err) {
      console.log("photoerr", err);
    }

    const { width, height } = await getImageSize(imageurl);
    let imageDetails = {
      imgurl: imageurl,
      caption: caption,
      width: width,
      height: height,
    };
    console.log("ImageDetails ", imageDetails);
    try {
      const imagedata = await axios.post(
        `${SERVER_URL}/gallery/addPhoto`,
        imageDetails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (imagedata.status === 422 || !imagedata) {
        window.alert("Posting failed");
        console.log("Posting failed");
      } else {
        console.log("data");
        console.log(imagedata);
        console.log("Posting Successfull");
        window.location.reload(true);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const getHomePhotos = async () => {
    try {
      let imagedata = [];
      const data = await axios.get(`${SERVER_URL}/gallery/getHomepagePhotos`);

      imagedata = data.data;
      // console.log("imagedata", imagedata);

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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHomePhotos();
  }, []);

  return (
    <div className="gallery-container adjust">
      <div className="titlebox">
        <h4 className="my-3">Image Gallery</h4>
        {user && user.isadmin ? (
          <button
            type="button"
            className="btn btn-success btn-rounded btn-sm my-3"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-plus-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg>{" "}
            Add Image
          </button>
        ) : null}
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Add Image
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={postImage} method="POST">
                <div className="modalform">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handlePhoto}
                    className="form-control my-2"
                    id="photo"
                    aria-describedby="photo"
                    required
                  />
                  <input
                    type="text"
                    name="title"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="form-control"
                    id="caption"
                    aria-describedby="title"
                    placeholder="Enter caption"
                    required
                  />
                </div>
                <br></br>
                <button
                  type="submit"
                  name="submit"
                  id="submit"
                  className="btn btn-primary"
                >
                  {add ? (
                    <>
                      <span>Uploading </span>
                      <i className="fa fa-spinner fa-spin"></i>
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
                {/* <div className="modal-footer">
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Upload</button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>

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
      <p>
        <NavLink to="/gallery">
          View all Images<span className="small"> ❯</span>
        </NavLink>
      </p>
    </div>
  );
};

export default PhotoGallery;
