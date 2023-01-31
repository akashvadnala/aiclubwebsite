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

const Blogs = () => {
  const [blogList, setblogList] = useState([]);
  const { user } = useContext(Context);
  const [blogs, setBlogs] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [load, setLoad] = useState(0);

  const getBlogData = async () => {
    try {
      axios.get(`${SERVER_URL}/getBlogs`).then((data) => {
        if (data.status === 200) {
          console.log("data", data.data);
          setBlogs(data.data);
          setblogList(data.data);
          setLoad(1);
        } else {
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlogData();
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
          <Helmet>
            <title>Blogs - AI Club</title>
          </Helmet>
          <div>
            <div className="row py-4">
              <div className="col-md-4 text-center text-md-start">
                <h2>Blogs</h2>
              </div>
              <div className="col-md-8 text-center text-md-end">
                {user ? (
                  <>
                    {user.isadmin && (
                      <NavLink
                        rel="noreferrer"
                        to="/blogapprovals"
                        className="btn btn-sm btn-secondary mx-1"
                      >
                        Approvals
                      </NavLink>
                    )}
                    <NavLink
                      rel="noreferrer"
                      to="/myblogs"
                      className="btn btn-sm btn-secondary mx-1"
                    >
                      My Blogs
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

export default Blogs;
