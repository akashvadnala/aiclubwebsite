const express = require("express");
const router = express.Router();
const Blog = require("../model/BlogSchema");
const Team = require("../model/teamSchema");
const authenticate = require("../middleware/authenticate");
const {generalMail} = require("../controllers/mail")

router.route("/updateBlog/:id").put(authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const blogdata = req.body;
    blogdata.url = blogdata.url.trim().replace(/\s+/g, '-').toLowerCase();
    const updatedBlog = await Blog.findByIdAndUpdate(id, blogdata, {
      new: true,
    });
    console.log("Blog Updated");
    res.status(200).json({ msg: "Blog updated successful" });
  } catch (err) {
    res.status(500).json({ error: "Problem at server" });
  }
});

router.route("/updateblogPublicStatus/:url").put(authenticate, async (req, res) => {
  console.log("updateblogPublicStatus called");
  try {
    const { url } = req.params;
    const updatedBlog = await Blog.findOne({ url: url });
    if (!updatedBlog) {
      res.status(404).json({ error: "Blog not found" });
    }
    updatedBlog.public = req.body.public;
    updatedBlog.save();
    
    res.status(200).json({ msg: "Public status updated" });
  } catch (err) {
    res.status(500).json({ error: "Problem at server" });
  }
});

router.route("/updateblogApprovalStatus/:url").put(authenticate, async (req, res) => {

  try {
    const { url } = req.params;
    const updatedBlog = await Blog.findOne({ url: url });
    if (!updatedBlog) {
      res.status(404).json({ error: "Blog not found" });
    }
    
    let toaddress = "";
    let subject = "";
    let body = "";
    const user = await Team.findById(updatedBlog.authorName);

    if(req.body.approvalStatus=="pending"){
      updatedBlog.approvalStatus = req.body.approvalStatus;
      subject = "New Blog - Submitted"
      body = `Hi ${user.firstname} ${user.lastname} \n This mail is to inform you that your blog post titled "${updatedBlog.title}" has been Submitted for admin approval. 
       \n\n Regards\nAI Club`;
    }
    else{
      updatedBlog.approvalStatus = req.body.approvalStatus;
      updatedBlog.public = req.body.public;

      if(req.body.approvalStatus=="Approved"){
        subject = "New Blog - Approved"
        body = `Hi ${user.firstname} ${user.lastname} \n This mail is to inform you that your blog post titled "${updatedBlog.title}" has been Accepted by the admin. 
       \n\n Regards\nAI Club`;
      }
      else if(req.body.approvalStatus=="Rejected"){
        subject = "New Blog - Rejected"
        body = `Hi ${user.firstname} ${user.lastname} \n This mail is to inform you that your blog post titled "${updatedBlog.title}" has been rejected by the admin. 
        \n Please contact admin/Secretary for furthur details. \n\n Regards\nAI Club`;
      }
      
    }
    updatedBlog.save();
    toaddress = user.email;

    generalMail(toaddress,subject,body);
    console.log("blog status Updated");

    res.status(200).json({ msg: "Approval status updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.route("/addBlog").post(authenticate, async (req, res) => {
  const title = req.body.title;
  if (!title) {
    res.status(400).json({ error: "Plz fill the field properly" });
  }
  try {
    // console.log('blog',req.body);
    const blogdata = req.body;
    blogdata.url = blogdata.url.trim().replace(/\s+/g, '-').toLowerCase();
    const blog = new Blog(blogdata);
    await blog.save();

    console.log(`${blog.title} blog created successfully`);
    res.status(201).json({ message: "Blog posting Successful" , url:blog.url});
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: "Problem at server" });
  }
});


router.route("/getBlogs").get(async (req, res) => {

  try {
    const blogData = await Blog.find({ public: true }).sort({ createdAt: -1 }).select(
      "-_id -content -authorAvatar -public -approvalStatus"
    );
    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ error: "Problem At fetching blogs" });
  }
});

router.route("/getFirstLastNameForBlogs/:url").get(async (req, res) => {

  try {
    const blog = await Blog.findOne({ url: req.params.url });
    let name = "";
    if (blog) {
      const team = await Team.findById(blog.authorName);
      name = `${team.firstname} ${team.lastname}`;
    }
    res.status(200).json(name);
  } catch (error) {
    res.status(500).json({ error: "Problem At fetching first and last name" });
  }


})

router.route("/getsixBlogs").get(async (req, res) => {

  try {
    let blogData = await Blog.find({ public: true }).sort({ createdAt: -1 }).select(
      "-_id -content -authorAvatar -public -approvalStatus"
    );
    blogData = blogData.slice(0, 6);
    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ error: "Problem at server" });
  }
});

router.route("/getpendingBlogApprovals").get(async (req, res) => {
  try {
    const blogData = await Blog.find({ approvalStatus: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ error: "Problem at server" });
  }

});

router.route("/getuserBlogs/:id").get(async (req, res) => {
  const { id } = req.params;
  try {
    const blogData = await Blog.find({ authorName: id }).sort({ createdAt: -1 });
    res.status(200).json(blogData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Problem at server getuserBlogs" });
  }
});

router.route("/isBlogUrlExist/:url").get(async (req, res) => {
  const { url } = req.params;
  Blog.findOne({ url: url }).then(data => {
    return data ? res.status(404).send({ error: "Url Already Exist!" }) : res.status(200).json();
  })
})

router.route("/getBlog/:url").get(async (req, res) => {
  const { url } = req.params;
  try {
    const blog = await Blog.findOne({ url: url });
    if (!blog) {
      res.status(404).json({error:"Blog does not exist"});
    } else {
      const userdetails = await Team.findById(blog.authorName).select(
        "firstname lastname email position profession photo github linkedin"
      );
      // console.log("blog", blog);
      res.status(200).json({ blog: blog, author: userdetails });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Problem at server" });
  }
});

router.route("/getBlogEdit/:url").get(async (req, res) => {
  const { url } = req.params;
  try {
    var blog = await Blog.findOne({ url: url });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({error:"blog doesn't exist"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Problem at server" });
  }
});

router.route("/deleteBlog/:id").delete(authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (blog) {
      await Blog.findByIdAndDelete(id);
      res.status(200).json({ msg: "Blog Deleted" });
    }else{
      res.status(404).json({error:"blog doesn't exist"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem at server" });
  }
});

router.route("/getprofileblogs/:id").get(async (req, res) => {
  try {
    const id = req.params.id;
    const blogs = await Blog.find({ authorName: id }).sort({ createdAt: -1 }).select("title url public -_id").limit(5);
    res.status(200).json({ blogs: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem at server" });
  }
})

module.exports = router;
