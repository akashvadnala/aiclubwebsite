const express = require("express");
const router = express.Router();
const Slider = require('../model/sliderSchema');

router.route('/getSlides').get(async (req,res)=>{
    try{
        const slides = await Slider.find({});
        slides.sort().reverse();
        const status=slides?200:201;
        res.status(status).json(slides);
    }catch(err){
        console.log(err);
    }
});

router.route('/addSlider').post(async (req,res)=>{
    try{
        const slide = new Slider(req.body);
        await slide.save();
        console.log(`${slide.title} added`);
        res.status(200).json(null);
    }catch(err){
        console.log(err);
    }
});

router.route('/updateSlide/:id').put(async (req,res)=>{
    try{
        const data = await Slider.findById(req.params.id);
        if(data){
            await Slider.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
              });
        }
        else{
            console.log('Slider Not Found');
        }
    }catch(err){
        console.log(err);
    }    
});

router.route('/deleteSlide/:id').post(async (req,res)=>{
    try{
        await Slider.findByIdAndDelete(req.params.id);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;
