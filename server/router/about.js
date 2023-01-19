const express = require('express');
const router = express.Router();
const About = require('../model/AboutSchema');
require('../db/conn');

router.route('/updateAbout').put(async (req,res) => {
    try{
        const updatedAbout = await About.findOne({});
        updatedAbout.about = req.body.about;
        await updatedAbout.save();
        res.status(200).json(updatedAbout);
    }catch (err) {
        res.status(422).json(err);
    }
})

router.route('/getAbout').get(async (req,res) => {
    const aboutData = await About.find({});
    res.status(200).json(aboutData[0]);
});

module.exports = router;