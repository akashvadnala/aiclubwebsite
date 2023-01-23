import React, { useState, useContext, useEffect } from "react";
import Search from "./search/Search";
import BlogsList from "./BlogsList";
import "./Blogs.css";
import EmptyList from "./search/EmptyList";
import { Context } from "../../Context/Context";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";
import { Helmet } from "react-helmet";

const Blogs = () => {
  const [blogList, setblogList] = useState([]);
  const { user } = useContext(Context);
  const [filtermode, setfiltermode] = useState("My Blogs");
  const [blogs, setBlogs] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const getBlogData = async () => {
    try {
      axios.get(`${SERVER_URL}/getBlogs`).then((data) => {
        console.log("data", data.data);
        setBlogs(data.data);
        setblogList(data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getuserBlogData = async (name) => {
    try {
      axios.get(`${SERVER_URL}/getuserBlogs/${name}`).then((data) => {
        console.log("data", data.data);
        setBlogs(data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);

  // Search submit
  const handleSearchBar = (e) => {
    e.preventDefault();
    handleSearchResults();
  };

  // Search for blog by category
  const handleSearchResults = () => {
    const allBlogs = blogList;
    const filteredBlogs = allBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchKey.toLowerCase().trim()) ||
        blog.authorName
          .toLowerCase()
          .includes(searchKey.toLowerCase().trim()) ||
        Boolean(
          blog.tags.filter((tag) =>
            tag.toLowerCase().includes(searchKey.toLowerCase().trim())
          ).length
        )
    );
    setBlogs(filteredBlogs);
  };

  // Clear search and show all blogs
  const handleClearSearch = () => {
    setBlogs(blogList);
    setSearchKey("");
  };

  const filterMyblogs = (name) => {
    const allBlogs = blogList;
    if (filtermode === "All Blogs") {
      setBlogs(allBlogs);
      setfiltermode("My Blogs");
    } else {
      getuserBlogData(name);
      setfiltermode("All Blogs");
    }
  };
  return (
    <>
      <div className="blog-container container">
        <div>
          <Helmet>
            <title>Blogs - AI Club</title>
          </Helmet>
          <div className="row py-4">
            <div className="col-4">
              {(filtermode !== "All Blogs")? <h2>Blogs</h2> : <h2>My Blogs</h2>}
            </div>
            <div className="col-8 text-end">
              {user ? (
                <>
                  <button
                    rel="noreferrer"
                    className={`btn btn-sm btn-${
                      filtermode === "All Blogs" ? "primary" : "secondary"
                    } mx-1`}
                    onClick={() => {
                      filterMyblogs(user.username);
                    }}
                  >
                    {filtermode}
                  </button>
                  <NavLink
                    type="button"
                    className="btn btn-sm btn-success"
                    to="/addblog"
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
                    Add Blog
                  </NavLink>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Search
          value={searchKey}
          clearSearch={handleClearSearch}
          formSubmit={handleSearchBar}
          handleSearchKey={(e) => setSearchKey(e.target.value)}
        />
        {!blogs.length ? <EmptyList /> : <BlogsList blogs={blogs} />}
      </div>
    </>
  );
};

export default Blogs;
