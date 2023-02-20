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
import {editorConfig,editorPreviewConfig} from "../../Params/editorConfig";

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
      else {
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
  
  const handleUrl = (e) => {
    let value = e.target.value;
    let url="";
    for(let i=0;i<value.length;i++){
      const c = value[i];
      if(("a"<=c && c<="z") || ("A"<=c && c<="Z") || ("0"<=c && c<="9") || c==="-" || c==='_'){
        url+=c;
      }
      else{
        showAlert("Special Characters are not allowed except '-' and '_'","danger");
      }
    }
    setpost({...post,url:url});
  }

  const removeXTag = (tag) => {
    let current = post.tags;
    current = current.filter((x) => x !== tag);
    setpost({ ...post, ["tags"]: current });
    setXTag("");
  };
  const AddXTag = () => {
    let s=xtag.trim();
    if(s!=""){
      let current = post.tags;
      current.push(s);
      setpost({ ...post, ["tags"]: current });
      setXTag("");
    }
    
  };
  const UpdateBlog = async (e) => {
    e.preventDefault();
    try {
      if (url !== post.url) {
        const blogExist = await axios.get(`${SERVER_URL}/blogs/canAddBlog/${post.url}`);
      }
      setAdd(true);
      if (Img) {
        const data = new FormData();
        const photoname = Date.now() + Img.name;
        data.append("name", photoname);
        data.append("photo", Img);
        await axios.post(`${SERVER_URL}/imgdelete`,
          { 'url': post.cover },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
        const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
        post.cover = img.data;

      }
      
      const postdata = await axios.put(
        `${SERVER_URL}/blogs/updateBlog/${post._id}`,
        post,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setAdd(false);
      showAlert("Saved as Draft!", "success");
      setPreview(true);

    } catch (err) {
      showAlert(`${err.response.data.error}`, "danger");
      // navigate('/myblogs');
    }

  };
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container editblog-container py-3">
          <h3 className="text-center">Edit Blog</h3>
          <div className="text-center fs-6 pb-1">
            {preview ? (
              <NavLink
                to={`/blogs/${post.url}`}
                rel="noreferrer"
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
                    placeholder="Enter Tags"
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
                      onChange={handleUrl}
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
                        placeholder="Enter Tags"
                      />
                    </div>
                    <div className="col-4 paddl">
                      <button
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXTag}
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
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group my-1">
                  <label htmlFor="content">Blog Content :</label>
                </div>
                <div className="form-group mb-4">
                  <JoditEditor
                    className="jodit-editor-border"
                    name="content"
                    ref={editor}
                    value={post ? post.content : ""}
                    config={editorConfig}
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
