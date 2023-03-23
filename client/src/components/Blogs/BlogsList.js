import React from "react";
import BlogItem from "./card/BlogCard";


const BlogsList = (props) => {

  return (
    <div>
      <div className="row">
        {props.blogs.map((blog) => {
          return (
            <div className="col-md-4 mb-4" key={blog.url}>
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
