import React, { useState, useContext, useEffect } from "react";
import BlogsList from "../../Blogs/BlogsList";
import { Context } from "../../../Context/Context";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import "./RecentBlogs.css";
import Loading from "../../Loading";
import Error from "../../Error";

function RecentBlogs() {
  const { user } = useContext(Context);
  const [blogs, setBlogs] = useState([]);
  const [load, setLoad] = useState(0);

  const getsixBlogData = async () => {
    try {
      axios.get(`${SERVER_URL}/getsixBlogs`).then((data) => {
        if (data.status === 200) {
          console.log("recent blogs data", data.data);
          setBlogs(data.data);
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
    getsixBlogData();
  }, [user]);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="recentblogs-container adjust">
          <h3 className="text-center py-3">Recent Blogs</h3>
          <BlogsList blogs={blogs} />
          <p>
            <NavLink to="/blogs">
              View all blogs<span className="small"> ❯</span>
            </NavLink>
          </p>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
}

export default RecentBlogs;
