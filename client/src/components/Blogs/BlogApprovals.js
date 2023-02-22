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
import Loading from "../Loading";
import Error from "../Error";

const BlogApprovals = () => {
  const [blogList, setblogList] = useState([]);
  const { user, logged_in } = useContext(Context);
  const [filtermode, setfiltermode] = useState("My Blogs");
  const [blogs, setBlogs] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [load, setLoad] = useState(0);

  const getBlogApprovals = async () => {
    try {
      axios.get(`${SERVER_URL}/blogs/getpendingBlogApprovals`).then((data) => {
        if (data.status === 200) {
          setBlogs(data.data);
          setblogList(data.data);
        } else {
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (logged_in === 1) {
      if (user.isadmin) {
        getBlogApprovals();
        setLoad(1);
      } else {
        setLoad(-1);
      }
    } else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [user]);

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

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="blog-container container">
          <div>
            <div className="row py-4">
              <div className="col-4">
                <Helmet>
                  <title>Blogs - AI Club</title>
                </Helmet>
                <h2>Requires Approval</h2>
              </div>
              <div className="col-8 text-end">
                {user ? (
                  <>
                    <NavLink
                      rel="noreferrer"
                      to="/blogs"
                      className="btn btn-sm btn-primary mx-1"
                    >
                      All Blogs
                    </NavLink>
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
                        viewBox="0 0 16 18"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg>{" "}
                      Add Blog
                    </NavLink>
                  </>
                ) : null}
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
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default BlogApprovals;
