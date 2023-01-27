import React, { useState, useContext, useEffect } from "react";
import BlogsList from "../../Blogs/BlogsList";
import { Context } from "../../../Context/Context";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import "./RecentBlogs.css";

function RecentBlogs() {
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

  return (
    <div className="recentblogs-container adjust">
      <h3 className="text-center py-3">Recent Blogs</h3>
      <BlogsList blogs={blogs} />
      <p>
        <NavLink to="/blogs">
          View all blogs<span className="small"> ❯</span>
        </NavLink>
      </p>
    </div>
  );
}

export default RecentBlogs;
