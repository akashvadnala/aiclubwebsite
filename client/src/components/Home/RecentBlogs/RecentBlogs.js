import React from "react";
import BlogsList from "../../Blogs/BlogsList";
import { NavLink } from "react-router-dom";
import "./RecentBlogs.css";

function RecentBlogs({blogs}) {
  return (
    <>
        <div className="recentblogs-container py-5 adjust">
          <h3 className="text-center pb-3">Recent Blogs</h3>
          <BlogsList blogs={blogs} />
          <p>
            <NavLink to="/blogs">
              View all blogs<span className="small"> ❯</span>
            </NavLink>
          </p>
        </div>
    </>
  );
}

export default RecentBlogs;
