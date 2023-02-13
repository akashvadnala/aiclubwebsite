import React from "react";
import { useContext, useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import './gallery.css';
import { Context } from "../../../Context/Context";
import { SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import { getImageSize } from 'react-image-size';
import { alertContext } from "../../../Context/Alert";
import { useNavigate } from "react-router-dom";

const AllPhotos = () => {
  const { user } = useContext(Context);
  const { showAlert } = useContext(alertContext);

  const navigate = useNavigate();
  const [index, setIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [canDelete, setCanDelete] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [del, setDel] = useState(false);
  const [image, setImage] = useState();

  const getAllPhotos = async () => {
    try {
      let imagedata = [];
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
          title: photo.caption,
        })
      });
      setPhotos(photoArray);
      // console.log("photos ",photos);
    } catch (err) {
      console.log(err);
      navigate('/gallery');
      showAlert("Problem at fetching photos","danger");
    }
  };

  const handleSelect = (e) => {
    // e.preventDefault();
    const { value, checked } = e.target;
    if (checked) {
      setSelectedImages([...selectedImages, value]);
    } else {
      const newList = selectedImages.filter((url) => value != url);
      setSelectedImages(newList);
    }
    console.log(selectedImages);
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      return;
    }
    setDel(true);
    try {
      const response = await axios.delete(
        `${SERVER_URL}/gallery/deleteImages`,
        {
          data:{
            urls: selectedImages
          },
          headers: { "Content-Type": "application/json" },
          withCredentials: true
          
        });


      console.log("data");
      console.log(response);
      showAlert("Image Deleted Successfully", "success");
      console.log("deleted Successfull");
    } catch (error) {
      console.log(error);
      window.alert('Error while deleting images please try again');
    }
    window.location.reload(true);
  }

  useEffect(() => {
    getAllPhotos();
  }, []);

  const [caption, setCaption] = useState("");
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
      const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
      imageurl = img.data;
      console.log("final image", imageurl);
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
            withCredentials: true,
          }
        );

        console.log("data");
        console.log(imagedata);
        console.log("Posting Successfull");
        showAlert("Image Uploaded Successfully", "success");
      } catch (err) {
        console.log("posting err", err);
        showAlert("Image upload failed","danger");
      }
    } catch (err) {
      console.log("photoerr", err);
      showAlert("Image Upload failed","danger");
    }

    window.location.reload(true);
  };


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
      {canDelete ? (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox" value={restImageProps.src}
            id="flexCheckDefault"
            onChange={handleSelect}
          />
        </div>
      ) : null}
      <img alt={alt} style={{ ...style, width: "100%", padding: 0 }} {...restImageProps} />

    </div>
  );

  return (
    <div className="gallery-container container">
      <div className="py-3">
        <div className="row align-items-center">
          <div className="col-12 col-sm-4">
            <h3>All Images</h3>
          </div>
          <div className="col-12 col-sm-8 text-end">
            {user && user.isadmin ? (
              <>
                {canDelete ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        setSelectedImages([]);
                        setCanDelete(false)
                      }}
                    >
                      cancel
                    </button>
                    <button
                      type="button"
                      name="submit"
                      className="btn btn-sm btn-danger ms-2"
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
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={() => setCanDelete(true)}
                  >
                    Enable Delete
                  </button>
                )}

              </>
            ) : null}
            {' '}
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
                  viewBox="0 0 16 18"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                </svg>{" "}
                Add Image
              </button>
            ) : null}
          </div>
        </div>
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
        renderPhoto={renderPhoto}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        styles={{ container: { backgroundColor: "rgba(240,240,240,.9)" } }}
        className='lightbox'
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

