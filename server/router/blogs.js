const express = require('express');
const router = express.Router();
const Blog = require('../model/BlogSchema');

router.route('/updateBlog/:url').put(async (req,res) => {
    try{
        const {url} = req.params;
        // console.log('req.body',req.body.url,req.body)
        const updatedBlog = await Blog.findOneAndUpdate({url:url},req.body,{
            new:true
        });
        console.log('Project Updated',updatedBlog);
        res.status(200).json(updatedBlog);
    }catch (err) {
        res.status(422).json(err);
    }
})

router.route('/blogadd').post(async (req,res) => {
    const title = req.body.title;
    if( !title){
        return res.status(400).json({ error: "Plz fill the field properly" });
    }
    console.log("Posting..");
    try{
        const blog = new Blog(
        req.body
        );
        await blog.save();

        console.log(`${blog.title} registered successfully`);
        res.status(201).json({ message: "Blog posting Successfully" });
        
    }catch(err){
        console.log('err',err);
    }  
});

router.route('/getBlogs').get(async (req,res) => {
    const blogData = await Blog.find({});
    console.log('blogData',blogData);
    res.status(200).json(blogData);
});

router.route('/getBlog/:url').get(async (req,res) => {
    const {url} = req.params;
    try{
        const blog = await Blog.findOne({url:url});
        if(blog){
            console.log('blog',blog);
            return res.status(200).json(blog);
        }
        else{
            return res.status(201).json(null);
        }
    }catch(err){
        console.log(err);
        res.status(422).send(`${url} not found`);
    }
})

router.route('/getBlogEdit/:url').get(async (req,res) => {
    const {url} = req.params;
    try{
        var blog = await Blog.findOne({url:url});
        if(blog){
            return res.status(200).json(blog);
        }
        else{
            return res.status(201).json(null);
        }
    }catch(err){
        console.log(err);
        res.status(422).send(`${url} not found`);
    }
});

router.route('/deleteBlog/:url').post(async (req,res)=>{
    const {url} = req.params;
    console.log(url);
    try{
        await Blog.deleteOne({url:url});
        console.log('Deleted..');
        return res.status(200).json({msg:"Project Deleted"});
    } 
    catch(err){
        console.log("Cannot Delete the Project");
        return res.status(422).json({msg:"Cannot Delete the Project"});
    }
});

module.exports = router;