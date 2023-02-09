import React, { useContext, useState, useEffect } from "react";
import "./AddBlog.css";
import { Context } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import { CLIENT_URL, SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import { alertContext } from "../../../Context/Alert";
import Loading from "../../Loading";
import Error from "../../Error";

const AddBlog = () => {
  const navigate = useNavigate();
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [add, setAdd] = useState(false);
  const [xtag, setXtag] = useState("");
  const [post, setPost] = useState();
  const [load, setLoad] = useState(0);
  let pt = {
    title: "",
    url: "",
    tags: [],
    content: "",
    authorName: user ? user._id : "",
    cover: "",
  };
  console.log('load', load);
  useEffect(() => {
    if (logged_in === 1) {
      if (user && user.isadmin) {
        setPost(pt);
        setLoad(1);
      }
      else {
        setLoad(-1);
      }
    }
    else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in]);

  const handlePhoto = (e) => {
    setPost({ ...post, ["cover"]: e.target.files[0] });
  };

  const handleInputs = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const removeXtag = (tag) => {
    let current = post.tags;
    current = current.filter((x) => x !== tag);
    setPost({ ...post, ["tags"]: current });
    setXtag("");
  };

  const AddXtag = () => {
    let current = post.tags;
    current.push(xtag);
    setPost({ ...post, ["tags"]: current });
    setXtag("");
  };

  const PostBlog = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${SERVER_URL}/blogs/canAddBlog/${post.url}`);
      setAdd(true);
      const data = new FormData();
      data.append("photo", post.cover);
      const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
      post.cover = img.data;
      const blogdata = await axios.post(`${SERVER_URL}/blogs/addBlog`, post, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      navigate(`/blogs/${post.url}/edit`);
      showAlert("Blog added sucessfully!", "success");
    } catch (error) {
      showAlert(`${error.response.data.error}`, "danger");
    }
    setAdd(false);
  }
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ?
        <div className="container addBlog-container text-center">
          <div className="adjust">
            <h3>Add Blog</h3>
            <form
              method="POST"
              onSubmit={PostBlog}
              encType="multipart/form-data"
            >
              <div className="form-group my-3 row">
                <label htmlFor="title" className="col-sm-2 text-end">
                  Blog Title :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="title"
                    value={post.title}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Enter Blog Title"
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="url" className="col-sm-2 text-end">
                  Blog Url :
                </label>
                <div className="col-sm-10">
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
              </div>
              <div className="form-group my-3 row">
                <label className="col-sm-2 text-end">Tags :</label>
                <div className="col-sm-10">
                  {post.tags.map((a) => {
                    return (
                      <div className="form-group my-2 row">
                        <div className="col col-9">
                          <input
                            type="text"
                            value={a}
                            className="form-control"
                            id="tag"
                            aria-describedby="title"
                            disabled
                          />
                        </div>
                        <div className="col col-3">
                          <input
                            type="reset"
                            className="btn btn-danger"
                            onClick={() => removeXtag(a)}
                            value="Remove"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="form-group my-2 row">
                    <div className="col col-9">
                      <input
                        type="text"
                        name="xtag"
                        value={xtag}
                        onChange={(e) => setXtag(e.target.value)}
                        className="form-control"
                        id="tags"
                        aria-describedby="tags"
                        placeholder="Enter tags"
                      />
                    </div>
                    <div className="col col-3">
                      <input
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXtag}
                        value="+Add"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Blog Cover Photo :
                </label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handlePhoto}
                    className="form-control"
                    id="photo"
                    aria-describedby="photo"
                    required
                  />
                </div>
              </div>
              {
                add ?
                  <button type="submit" name="submit" id="submit" className="btn btn-primary" disabled>
                    Creating <i className="fa fa-spinner fa-spin"></i>
                  </button>
                  :
                  <button type="submit" name="submit" id="submit" className="btn btn-primary">
                    Create
                  </button>
              }
            </form>
          </div>
        </div>
        : (
          <Error />
        )}

    </>
  );
}

export default AddBlog;
