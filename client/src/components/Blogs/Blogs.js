import React, { useState, useContext } from "react";
import { blogList } from "./config/data";
import Search from "./search/Search";
import BlogsList from "./BlogsList";
import EmptyList from "./search/EmptyList";
import { Context } from "../../Context/Context";
import { NavLink } from "react-router-dom";

const Blogs = () => {
  const { user } = useContext(Context);
  const [blogs, setBlogs] = useState(blogList);
  const [searchKey, setSearchKey] = useState("");

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
          blog.tags.filter(
            (tag) =>
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
  return (
    <>
      <div className="container d-flex align-items-start flex-column bd-highlight">
        {user && (
          <NavLink
            type="button"
            className="btn btn-success mb-1 mt-3"
            to="/blogs/editor/add"
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
            Create New Blog
          </NavLink>
        )}
        {user && (
          <div className="form-check form-switch mb-3 mt-1">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              My Blogs
            </label>
          </div>
        )}
      </div>

      <div className="text-center">
        <h1 style={{ margin: "10px 0px" }}>Blogs</h1>
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
