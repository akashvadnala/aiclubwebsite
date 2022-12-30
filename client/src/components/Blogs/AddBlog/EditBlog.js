import React, { useRef, useState, useMemo, useContext, useEffect } from "react";
import "./AddBlog.css";
import JoditEditor from "jodit-react";
import { Context } from "../../../Context/Context";
import { NavLink, useParams } from "react-router-dom";
import Error from "../../Error";
import axios from "axios";
import { SERVER_URL } from "../../../EditableStuff/Config";
import Loading from "../../Loading";

const EditBlog = () => {
  const { url } = useParams();
  const editor = useRef(null);
  const { user } = useContext(Context);

  const [add, setAdd] = useState("Save as Draft");
  const [add2, setAdd2] = useState();
  const [xtag, setXTag] = useState("");
  const [post, setpost] = useState();
  const [load, setLoad] = useState(0);
  const [preview, setPreview] = useState(false);
  const getBlog = async () => {
    try {
      axios.get(`${SERVER_URL}/getBlogEdit/${url}`).then((data) => {
        if (data.status === 200) {
          console.log("blog", data.data);
          const post_ = data.data
          if(user && post_.authorName.indexOf(user.username)>-1){
          setpost(data.data);
          setLoad(1);
        }
        else{
          setLoad(-1);
        }
        } else {
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getBlog();
  }, []);

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
    setAdd("Saving ");
    setAdd2(<i class="fa fa-spinner fa-spin"></i>);
    try {
      const postdata = await axios.put(
        `${SERVER_URL}/updateBlog/${url}`,
        post,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("projdata", postdata);
      if (postdata.status === 422 || !postdata) {
        console.log("Project not found");
      } else {
        setAdd("Save as Draft");
        setAdd2("");
        setPreview(true);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  console.log("proj", post);
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="container addproject-container py-3">
          <h3 className="text-center">Add Blog</h3>
          <div className="text-center fs-6 pb-1">
            {preview ? (
              <NavLink to={`/blogs/${post.url}`}>Preview</NavLink>
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
                  <label for="title">Blog Title :</label>
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

                <div className="form-group my-1">
                  <label>Blog Tags :</label>
                </div>
                <div className="form-group my-2 row">
                  {post &&
                    post.tags.map((a) => {
                      return (
                        <div className="col-12 col-sm-6 col-lg-4 mb-2 row">
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
                  <label for="content">Blog Content :</label>
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
                <div>
                  <button
                    type="submit"
                    name="submit"
                    id="submit"
                    className="btn btn-primary my-3"
                  >
                    {add}
                    {add2}
                  </button>
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
