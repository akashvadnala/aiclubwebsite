import React from "react";
import BlogItem from "./card/BlogCard";


const BlogsList = (props) => {

  return (
    <div className="container ">
      <div className="row">
        {props.blogs.map((blog) => {
          return (
            <div className="col-md-4" key={blog.id}>
              <BlogItem
                blog = {blog}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogsList;
