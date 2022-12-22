const express = require('express');
const router = express.Router();
const Blog = require('../model/BlogSchema');

router.route('/blogadd').post(async (req,res) => {
    const authorName = req.body.authorName;
    const title = req.body.title;
    const url = req.body.url;
    const content = req.body.content;
    const tags = req.body.tags;
    const authorAvatar = req.body.authorAvatar;
    const cover = req.body.cover;
    if( !title || !content){
        return res.status(400).json({ error: "Plz fill the field properly" });
    }
    console.log("Posting..");
    try{
        const blog = new Blog(
        //     { 
        //     authorName:authorName, 
        //     title:title,  
        //     url:url,
        //     content:content,
        //     tags:tags,
        //     authorAvatar:authorAvatar,
        //     cover:cover,
        // }
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


module.exports = router;