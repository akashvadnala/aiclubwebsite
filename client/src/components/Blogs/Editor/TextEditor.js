import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import { Context } from "../../../Context/Context";

const TextEditor = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [add, setAdd] = useState("Post");
  const [add2, setAdd2] = useState();
  const editor = useRef(null);
  const [post, setPost] = useState({
    title: "",
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
    setPost({ ...post, cover: e.target.files[0] });
  };

  const contentFieldChanaged = (data) => {
    setPost({ ...post, content: data });
  };
  const titleFieldChanaged = (event) => {
    setPost({ ...post, title: event.target.value });
  };

  const handleClearClick = () => {
    setPost({ ...post, title: "", tags: [], content: "", cover: "" });
  };

  const handleSubmitClick = async () => {
    setAdd("Posting ");
    setAdd2(<i class="fa fa-spinner fa-spin"></i>);
    console.log(post);
    const data = new FormData();
    const photoname = Date.now() + post.cover.name;
    data.append("name", photoname);
    data.append("photo", post.cover);
    var imgurl;

    try {
      const img = await axios.post("http://localhost:5000/imgupload", data);
      console.log("img", img);
      imgurl = img.data;
      console.log(imgurl);
      setPost({ ...post, cover: imgurl });
      console.log("final post",post);
    } catch (err) {
      console.log("photoerr", err);
    }
    try{
      const blogdata = await axios.post('http://localhost:5000/blogadd',
          {
            'authorName':post.authorName, 
            'title':post.title,  
            'content':post.content,
            'tag':post.tags,
            'authorAvatar':post.authorAvatar,
            'cover':imgurl,
          },
          {
              headers:{"Content-Type" : "application/json"}
          }
      );
      console.log('blogdata',blogdata);
      if(blogdata.status === 422 || !blogdata){
          window.alert("Posting failed");
          console.log("Posting failed");
      }
      else{
          console.log('data');
          console.log(blogdata);
          console.log("Posting Successfull");
          navigate('/blogs');
      }
  }catch(err){
      console.log('err',err);
  }
  };

  return (
    <div className="container texteditor">
      <div className="mb-3 my-4">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Blog Title
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Title"
          value={post.title}
          onChange={titleFieldChanaged}
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
      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Blog Content
        </label>
        <JoditEditor
          ref={editor}
          value={post.content}
          onChange={(newContent) => contentFieldChanaged(newContent)}
        />
      </div>
      <div className="d-flex justify-content-center">
        <NavLink
          type="button"
          className="btn btn-secondary btn-sm mx-2 my-4"
          to="/blogs"
        >
          Back
        </NavLink>
        <button
          type="button"
          className="btn btn-primary btn-sm mx-2 my-4"
          onClick={handleSubmitClick}
        >
          {add}
          {add2}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm mx-2 my-4"
          onClick={handleClearClick}
        >
          Clear Content
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
