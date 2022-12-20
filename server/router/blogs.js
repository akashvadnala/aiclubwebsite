const express = require('express');
const router = express.Router();
const Blog = require('../model/BlogSchema');
require('../db/conn');

const blogadd = async (req,res) => {
    const authorName = req.body.authorName;
    const title = req.body.title;
    const content = req.body.content;
    const tag = req.body.tag;
    const authorAvatar = req.body.authorAvatar;
    const cover = req.body.cover;
    if( !title || !content){
        return res.status(400).json({ error: "Plz fill the field properly" });
    }
    console.log("Posting..");
    try{
        const blog = new Blog({ 
            authorName:authorName, 
            title:title,  
            content:content,
            tag:tag,
            authorAvatar:authorAvatar,
            cover:cover,
        });
        await blog.save();

        console.log(`${blog} registered successfully`);
        res.status(201).json({ message: "Blog posting Successfully" });
        
    }catch(err){
        console.log('err',err);
    }  
}
router.route('/blogadd').post(blogadd);

module.exports = router;