const express = require('express');
const router = express.Router();
const Photo = require('../model/gallerySchema');

router.route('/getHomepagePhotos').get(async (req,res)=> {
    try {
        const somePhotos = await Photo.find({}).sort({createdAt:-1}).limit(8);
        res.status(200).send(somePhotos);
    } catch (error) {
        console.log(error);
        res.status(500).json({"msg":"error while getting photos"});
    }
});

router.route('/getAllPhotos').get(async (req,res)=>{
    try {
        const allPhtotos = await Photo.find({}).sort({createdAt:-1});
        res.status(200).send(allPhtotos);
    } catch (error) {
        console.log(error);
        res.status(500).json({"msg":"Problem with getting Photos"});
    }
});

router.route('/addPhoto').post(async (req,res)=> {
    try {
        const photo = req.body;
        console.log(photo);
        const newPhoto = new Photo(photo);
        await newPhoto.save();
        console.log(`Image uploaded sucessfully`);
        res.status(201).json({'msg':'photo added sucessfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({"msg":"Problem with adding Photo"});
    }
});

module.exports = router;