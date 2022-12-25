import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import axios from "axios";
import { Context } from "../../../Context/Context";
import { SERVER_URL } from "../../../EditableStuff/Config";
import { editorConfig } from "../../AddProject/Params/editorConfig";

const TextEditor = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [add, setAdd] = useState("Post");
  const [add2, setAdd2] = useState();
  const [xtag, setXtag] = useState("");
  const editor = useRef(null);
  const [post, setPost] = useState({
    title: "",
    url: "",
    tags: [],
    content: "",
    authorName: user.firstname + " " + user.lastname,
    authorAvatar: user.photo,
    cover: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/blogs");
    }
  }, [user]);

  const handlePhoto = (e) => {
    setPost({ ...post, ["cover"]: e.target.files[0] });
    console.log("post", post);
  };

  const contentFieldChanaged = (data) => {
    setPost({ ...post, ["content"]: data });
    console.log("post", post);
  };
  const handleInputs = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
    console.log("post", post);
  };

  const removeXtag = (tag) => {
    let current = post.tags;
    current = current.filter((x) => x !== tag);
    setPost({ ...post, ["tags"]: current });
    setXtag("");
    console.log("post", post);
  };
  const AddXtag = () => {
    let current = post.tags;
    current.push(xtag);
    setPost({ ...post, ["tags"]: current });
    setXtag("");
    console.log("post", post);
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    setAdd("Posting ");
    setAdd2(<i className="fa fa-spinner fa-spin"></i>);
    console.log(post);
    const data = new FormData();
    const photoname = Date.now() + post.cover.name;
    data.append("name", photoname);
    data.append("photo", post.cover);
    var imgurl;

    try {
      const img = await axios.post(`${SERVER_URL}/imgupload`, data);
      console.log("img", img);
      imgurl = img.data;
      console.log("img-url", imgurl);
      post.cover = imgurl;
      console.log("final post", post);
    } catch (err) {
      console.log("photoerr", err);
    }
    try {
      console.log("blogs");
      const blogdata = await axios.post(`${SERVER_URL}/blogadd`, post, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("blogdata", blogdata);
      if (blogdata.status === 422 || !blogdata) {
        window.alert("Posting failed");
        console.log("Posting failed");
      } else {
        console.log("data");
        console.log(blogdata);
        console.log("Posting Successfull");
        navigate("/blogs");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="container texteditor">
      <form
        method="POST"
        onSubmit={handleSubmitClick}
        encType="multipart/form-data"
      >
        <div className="mb-3 my-4">
          <label for="title" className="form-label">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            className="form-control"
            id="title"
            placeholder="Enter Blog Title"
            value={post.title}
            onChange={handleInputs}
          />
        </div>
        <div className="mb-3 my-4">
          <label for="url" className="form-label">
            Blog Url
          </label>
          <input
            type="text"
            name="url"
            className="form-control"
            id="url"
            placeholder="Enter Blog url"
            value={post.url}
            onChange={handleInputs}
          />
        </div>
        <div className="mb-3 my-4">
          <label htmlFor="cover" className="form-label">
            Upload Cover photo
          </label>
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
        <div className="form-group my-1">
          <label>Tags :</label>
        </div>
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
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            Blog Content
          </label>
          <JoditEditor
            ref={editor}
            value={post.content}
            config={editorConfig}
            onChange={(newContent) => contentFieldChanaged(newContent)}
          />
        </div>
        <div className="mb-3">
          {(post.cover || null) && (
            <div>
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                <h2>Card Preview :</h2>
              </label>
              <div className="my-3">
                <div className="card">
                  <img
                    src={URL.createObjectURL(post.cover)}
                    alt="blog"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title} </h5>
                    <p className="card-text">
                      <small className="text-muted">
                        By {!post.authorName ? "Unknown" : post.authorName} on
                        dd/mm/yy
                      </small>
                    </p>
                    <button
                      rel="noreferrer"
                      className="btn btn-sm btn-dark disabled"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {(post.cover || null) && (
            <div>
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                <h2>Blog Preview :</h2>
              </label>
              <p
                className="blog-desc"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></p>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            name="submit"
            id="submit"
            className="btn btn-primary btn-sm mx-2 my-4"
          >
            {add}
            {add2}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;
