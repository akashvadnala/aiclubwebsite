const express = require("express");
const router = express.Router();
const Blog = require("../model/BlogSchema");
const Team = require("../model/teamSchema");
const authenticate = require("../middleware/authenticate");

router.route("/updateBlog/:id").put(authenticate,async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log("Blog Updated");
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(201).json(err);
  }
});

router.route("/updateblogPublicStatus/:url").put(authenticate,async (req, res) => {
  try {
    const { url } = req.params;
    const updatedBlog = await Blog.findOne({ url: url });
    updatedBlog.public = req.body.public;
    updatedBlog.save();
    console.log("blog status Updated");
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.route("/updateblogApprovalStatus/:url").put(authenticate,async (req, res) => {
  try {
    const { url } = req.params;
    const updatedBlog = await Blog.findOne({ url: url });
    updatedBlog.approvalStatus = req.body.approvalStatus;
    updatedBlog.public = req.body.public;
    updatedBlog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.route("/addBlog").post(authenticate,async (req, res) => {
  const title = req.body.title;
  if (!title) {
    return res.status(400).json({ error: "Plz fill the field properly" });
  }
  try {
    // console.log('blog',req.body);
    const blog = new Blog(req.body);
    await blog.save();

    console.log(`${blog.title} blog created successfully`);
    res.status(201).json({ message: "Blog posting Successfully" });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({msg:"Internal server error"});
  }
});


router.route("/getBlogs").get(async (req, res) => {
  const blogData = await Blog.find({ public: true }).sort({createdAt:-1}).select(
    "-_id -content -authorAvatar -public -approvalStatus"
  );
  res.status(200).json(blogData);
});

router.route("/getFirstLastNameForBlogs/:url").get(async (req,res)=>{
  const blog = await Blog.findOne({url:req.params.url});
  let name="";
  if(blog){
      const team = await Team.findById(blog.authorName);
      name = `${team.firstname} ${team.lastname}`;
  }
  return res.status(200).json(name);
})

router.route("/getsixBlogs").get(async (req, res) => {
  let blogData = await Blog.find({ public: true }).sort({createdAt:-1}).select(
    "-_id -content -authorAvatar -public -approvalStatus"
  );
  blogData = blogData.slice(0, 6);
  res.status(200).json(blogData);
});

router.route("/getpendingBlogApprovals").get(async (req, res) => {
  const blogData = await Blog.find({ approvalStatus: "pending" }).sort({createdAt:-1});
  res.status(200).json(blogData);
});

router.route("/getuserBlogs/:id").get(async (req, res) => {
  const {id} = req.params;
  try {
    const blogData = await Blog.find({ authorName: id }).sort({createdAt:-1});
    res.status(200).json(blogData);
  } catch (err) {
    console.log(err);
    res.status(422).json(`Blog not found`);
  }
});

router.route("/isBlogUrlExist/:url").get(async (req,res)=>{
  const {url} = req.params;
  Blog.findOne({url:url}).then(data=>{
    if(data){
      res.status(200).json({msg:"Yes"});
    }else{
      res.status(200).json({msg:"No"});
    }
  }).catch(error=>{
    res.status(500).json({error:"Internal server Error"});
  });
})

router.route("/getBlog/:url").get(async (req, res) => {
  const { url } = req.params;
  try {
    const blog = await Blog.findOne({ url: url });
    if (!blog) {
      return res.status(404).json("Blog does not exist");
    } else {
      const userdetails = await Team.findById(blog.authorName).select(
        "firstname lastname email position description photo"
      );
      console.log("blog", blog);
      return res.status(200).json({ blog: blog, author: userdetails });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(`${url} not found`);
  }
});

router.route("/getBlogEdit/:url").get(async (req, res) => {
  const { url } = req.params;
  try {
    var blog = await Blog.findOne({ url: url });
    if (blog) {
      return res.status(200).json(blog);
    } else {
      return res.status(201).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
});

router.route("/deleteBlog/:id").delete(authenticate,async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if(blog) {
      const team = await Team.findById(blog.authorName);
      team.blogs = team.blogs.filter(b=> b != id);
      await team.save();
      await Blog.findByIdAndDelete(id);
      console.log("Deleted..");
      return res.status(200).json({ msg: "Blog Deleted" });
    } 
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  }
});

router.route("/getprofileblogs/:id").get(async (req,res)=>{
  try {
    const id = req.params.id;
    const blogs = await Blog.find({authorName:id}).sort({createdAt:-1}).select("title url -_id").limit(5);
    res.status(200).json({blogs:blogs});
  } catch (error) {
    console.log(error);
    res.status(500).json({"msg":"Internal server Error"});
  }
})

module.exports = router;
