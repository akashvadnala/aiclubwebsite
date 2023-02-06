const express = require('express');
const router = express.Router();
const About = require('../model/AboutSchema');

router.route('/updateAbout/:id').put(async (req,res) => {
    try{
        console.log('body',req.body);
        const updatedAbout = await About.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        res.status(201).json({msg:"About updated sucessfully"});
    }catch (err) {
        console.log(err);
        res.status(500).json({msg:"problem at server"});
    }
});

router.route('/getAbout').get(async (req,res) => {
    const aboutData = await About.findOne({});
    if(!aboutData){
        const about = new About();
        return res.status(200).json(about);
    }
    res.status(200).json(aboutData);
});

module.exports = router;