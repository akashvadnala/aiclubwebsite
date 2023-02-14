const express = require("express");
const router = express.Router();
const Slider = require('../model/sliderSchema');
const authenticate = require("../middleware/authenticate");

router.route('/getSlides').get(async (req,res)=>{
    try{
        let slides = await Slider.find({}).sort({index:1});
        res.status(200).json(slides);
    }catch(err){
        console.log(err);
        res.status(400).json({error:"Internal server error"});
    }
});

router.route('/addSlider').post(authenticate,async (req,res)=>{
    try{
        const slides = await Slider.find({});
        const index = slides.length+1;
        const slide = new Slider(req.body);
        slide.index = index;
        await slide.save();
        console.log(`${slide.title} added`);
        res.status(200).json();
    }catch(err){
        console.log('err',err);
        res.status(500).json({error:"Internal server error"});
    }
});

router.route('/updateSlider/:id').put(authenticate,async (req,res)=>{
    try{
        const data = await Slider.findById(req.params.id);
        if(data){
            await Slider.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
              });
            res.status(200).json();
        }
        else{
            console.log('Slider Not Found');
            res.status(404).json({error:"Slider Not Found"});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }    
});

router.route('/deleteSlider/:id').delete(authenticate,async (req,res)=>{
    try{
        await Slider.findByIdAndDelete(req.params.id);
        res.status(200).json();
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
})

router.route('/sortSlides').put(authenticate,async (req,res)=>{
    const {slides} = req.body;
    await Promise.all(
        slides.map(async ({_id},index)=>{
            let slide = await Slider.findById(_id);
            slide.index=index;
            await slide.save();
        })
    )
    res.status(200).json();
})

module.exports = router;
