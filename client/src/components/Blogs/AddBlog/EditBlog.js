import React, { useRef, useState, useMemo, useContext, useEffect } from "react";
import "./AddBlog.css";
import JoditEditor from "jodit-react";
import { Context } from "../../../Context/Context";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Error from "../../Error";
import axios from "axios";
import { CLIENT_URL, SERVER_URL } from "../../../EditableStuff/Config";
import Loading from "../../Loading";
import { alertContext } from "../../../Context/Alert";

const EditBlog = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);

  const [add, setAdd] = useState(false);
  const [xtag, setXTag] = useState("");
  const [post, setpost] = useState();
  const [Img, setImg] = useState();
  const [photo, setPhoto] = useState(null);
  const [load, setLoad] = useState(0);
  const [preview, setPreview] = useState(false);
  const getBlog = async () => {
    try {
      const data = await axios.get(`${SERVER_URL}/blogs/getBlogEdit/${url}`);
      if (data.status === 200) {
        const post_ = data.data;
        if (user && post_.authorName === user._id) {
          setpost(data.data);
          setLoad(1);
        } else {
          setLoad(-1);
        }
      } else {
        setLoad(-1);
      }
    } catch (err) {
      console.log(err);
      navigate('/blogs');
    }
  };
  useEffect(() => {
    if (logged_in === 1) {
      if (url) {
        getBlog();
      }
      else{
        setLoad(-1);
      }
    }
    else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in, url]);

  const handlePhoto = (e) => {
    setImg(e.target.files[0]);
    setPhoto(URL.createObjectURL(e.target.files[0]));
  }

  const handleValue = (e) => {
    setpost({ ...post, ["content"]: e });
  };

  const handleInputs = (e) => {
    setpost({ ...post, [e.target.name]: e.target.value });
  };

  const removeXTag = (tag) => {
    let current = post.tags;
    current = current.filter((x) => x !== tag);
    setpost({ ...post, ["tags"]: current });
    setXTag("");
  };
  const AddXTag = () => {
    let current = post.tags;
    current.push(xtag);
    setpost({ ...post, ["tags"]: current });
    setXTag("");
  };
  const UpdateBlog = async (e) => {
    e.preventDefault();
    try {
      if (url !== post.url) {
        const blogExist = await axios.get(`${SERVER_URL}/blogs/isBlogurlExist/${post.url}`);
        if (blogExist.status === 200) {
          showAlert("Url Already Exist!", "danger");
          return;
        }
      }
      setAdd(true);
      var imgurl;
      if (Img) {
        const data = new FormData();
        const photoname = Date.now() + Img.name;
        data.append("name", photoname);
        data.append("photo", Img);

        try {
          await axios.post(`${SERVER_URL}/imgdelete`,
            { 'url': post.cover },
            {
              headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
          console.log('photoerr', err);
        }

        try {
          const img = await axios.post(`${SERVER_URL}/imgupload`, data);
          console.log('img', img);
          imgurl = img.data;
          post.cover = imgurl;
        } catch (err) {
          console.log('photoerr', err);
        }
      }
      console.log('imgurl', imgurl);
      try {
        const postdata = await axios.put(
          `${SERVER_URL}/blogs/updateBlog/${post._id}`,
          post,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("projdata", postdata);
        if (postdata.status === 201 || !postdata) {
          showAlert("Failed to save", "danger");
          console.log("Project not found");
        } else {
          setAdd(false);
          showAlert("Saved as Draft!", "success");
          setPreview(true);
        }
      } catch (err) {
        console.log("err", err);
      }
    } catch (err) {
      console.log(err);
    }

  };
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container addproject-container py-3">
          <h3 className="text-center">Edit Blog</h3>
          <div className="text-center fs-6 pb-1">
            {preview ? (
              <NavLink
                to={`/blogs/${post.url}`}
                className="btn btn-success btn-sm"
              >
                Preview
              </NavLink>
            ) : (
              <span className="text-muted">Save for Preview</span>
            )}
          </div>

          <form
            method="POST"
            onSubmit={UpdateBlog}
            encType="multipart/form-data"
          >
            <div className="row">
              <div className="col-12 col-md-9">
                <div className="form-group mb-1">
                  <label htmlFor="title">Blog Title :</label>
                </div>
                <div className="form-group mb-4">
                  <input
                    type="text"
                    name="title"
                    value={post ? post.title : ""}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Enter Project Title"
                    required
                  />
                </div>

                <div className="form-group mb-1">
                  <label htmlFor="title">Blog Url :</label>
                </div>
                <div className="form-group mb-4">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text text-end"
                        id="basic-addon3"
                      >
                        {CLIENT_URL}/blogs/
                      </span>
                    </div>
                    <input
                      type="text"
                      name="url"
                      value={post.url}
                      onChange={handleInputs}
                      className="form-control"
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Enter Blog Url"
                      required
                    />
                  </div>
                </div>

                <div className="form-group my-1">
                  <label>Blog Tags :</label>
                </div>
                <div className="form-group my-2 row">
                  {post &&
                    post.tags.map((a, i) => {
                      return (
                        <div
                          className="col-12 col-sm-6 col-lg-4 mb-2 row"
                          key={i}
                        >
                          <div className="col-8 paddr">
                            <input
                              type="text"
                              value={a}
                              className="form-control"
                              id="tag"
                              aria-describedby="tag"
                              disabled
                            />
                          </div>
                          <div className="col-4 paddl">
                            <input
                              type="reset"
                              className="btn btn-danger"
                              onClick={() => removeXTag(a)}
                              value="Remove"
                            />
                          </div>
                        </div>
                      );
                    })}
                  <div className="col-12 col-sm-6 col-lg-4 mb-2 row">
                    <div className="col-8 paddr">
                      <input
                        type="text"
                        name="xauthor"
                        value={xtag}
                        onChange={(e) => setXTag(e.target.value)}
                        className="form-control"
                        id="tags"
                        aria-describedby="tags"
                        placeholder="Enter Project Title"
                      />
                    </div>
                    <div className="col-4 paddl">
                      <input
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXTag}
                        value="+Add"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group my-1">
                  <label htmlFor="content">Blog Content :</label>
                </div>
                <div className="form-group mb-4">
                  <JoditEditor
                    name="content"
                    ref={editor}
                    value={post ? post.content : ""}
                    onChange={handleValue}
                  />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="form-group mb-1">
                  <label htmlFor="title">Blog Cover Photo :</label>
                </div>
                <div className="form-group mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handlePhoto}
                    className="form-control"
                    id="photo"
                    aria-describedby="photo"
                  />
                </div>
                <div className="form-group mb-1">
                  <img src={photo ? photo : post.cover} alt={post.title} style={{ width: "100%", objectFit: "contain" }} />
                </div>
                <div>
                  {
                    add ?
                      <button
                        type="submit"
                        name="submit"
                        id="submit"
                        className="btn btn-primary my-3"
                        disabled
                      >
                        Saving <i className="fa fa-spinner fa-spin"></i>
                      </button>
                      :
                      <button
                        type="submit"
                        name="submit"
                        id="submit"
                        className="btn btn-primary my-3"
                        onClick={() => { setpost({ ...post, ["approvalStatus"]: "submit", ["public"]: false }); }}
                      >
                        Save as Draft
                      </button>
                  }
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default EditBlog;
