import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import EmptyList from "./search/EmptyList";
import { useNavigate } from "react-router-dom";
import "./BlogDisplay.css";
import ProfileCard from "./profile/ProfileCard";
import Tag from "./tags/Tag";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";
import { Context } from "../../Context/Context";
import { NavLink } from 'react-router-dom';


const BlogDisplay = () => {
  const params = new useParams();
  const url = params.url;
  const { user } = useContext(Context);
  const [blog, setBlog] = useState(null);
  const [edit, setedit] = useState(0);
  const navigate = useNavigate();

  const getBlog = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/getBlog/${url}`);
      console.log("blog", res.status);
      if (res.status === 200) {
        console.log("blog", res.data);
        const post_ = res.data;
        setBlog(res.data);
        if (user && post_.authorName.indexOf(user.username) > -1) {
          setedit(1);
        } else {
          setedit(0);
        }
      } else {
        setedit(0);
        console.log("No Blog Found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  const returnDDMMYYYY = (inp) => {
    const d = new Date(inp);
    const a =
      d.getDate() +
      "/" +
      String(parseInt(d.getMonth()) + 1) +
      "/" +
      d.getFullYear();
    return a;
  };

  const deleteBlog = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      `Are you sure to delete the blog "${blog.title}"?`
    );
    if (confirmed) {
      const res = await axios.post(`${SERVER_URL}/deleteBlog/${blog.url}`);
      if (res.status === 200) {
        navigate("/blogs");
      } else {
        console.log("Blog Cannot be deleted");
      }
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-around">
        {blog ? (
          <div className="blog-wrap">
            <header>
              <h3 className="mt-5">{blog.title}</h3>
              <p className="blog-date">
                Published on {returnDDMMYYYY(blog.createdAt)}
              </p>
              {edit && (
                <div className="text-center fs-6 p-2">
                  <NavLink to={`/blogs/${blog.url}/edit`}>Edit </NavLink>·
                  <NavLink rel="noreferrer" onClick={deleteBlog}>
                    {" "}
                    Delete
                  </NavLink>
                </div>
              )}
              <div className="blog-subCategory">
                {blog.tags.map((tag, i) => (
                  <div key={i}>
                    <Tag label={tag} />
                  </div>
                ))}
              </div>
            </header>
            <p
              className="blog-desc"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></p>
          </div>
        ) : (
          <EmptyList />
        )}
        {blog && (
          <ProfileCard
            authorAvatar={blog.authorAvatar}
            authorName={blog.authorName}
          />
        )}
      </div>
    </>
  );
};

export default BlogDisplay;
