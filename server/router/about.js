const express = require('express');
const router = express.Router();
const About = require('../model/AboutSchema');
const authenticate = require("../middleware/authenticate");

router.route('/updateAbout/:id').put(authenticate,async (req,res) => {
    try{
        const updatedAbout = await About.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        res.status(200).json({msg:"About updated sucessfully"});
    }catch (err) {
        console.log(err);
        res.status(500).json({msg:"problem at server"});
    }
});

router.route('/getAbout').get(async (req,res) => {
    const aboutData = await About.find({});
    res.status(200).json(aboutData[0]);
});

module.exports = router;