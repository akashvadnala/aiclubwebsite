const express = require("express");
const router = express.Router();
const Slider = require('../model/sliderSchema');

router.route('/getSlides').get(async (req,res)=>{
    try{
        let slides = await Slider.find({}).sort({index:"desc"});
        res.status(200).json(slides);
    }catch(err){
        console.log(err);
    }
});

router.route('/addSlider').post(async (req,res)=>{
    try{
        const slides = await Slider.find({});
        const index = slides.length+1;
        const slide = new Slider(req.body);
        slide.index = index;
        await slide.save();
        console.log(`${slide.title} added`);
        res.status(200).json(null);
    }catch(err){
        console.log(err);
    }
});

router.route('/updateSlider/:id').put(async (req,res)=>{
    try{
        const data = await Slider.findById(req.params.id);
        if(data){
            await Slider.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
              });
            res.status(200).json(null);
        }
        else{
            console.log('Slider Not Found');
        }
    }catch(err){
        console.log(err);
    }    
});

router.route('/deleteSlider/:id').post(async (req,res)=>{
    try{
        await Slider.findByIdAndDelete(req.params.id);
        res.status(200).json(null);
    }catch(err){
        console.log(err);
    }
})

router.route('/sliderMoveDown').post(async (req,res)=>{
    const {index} = req.body;
    try{
        let slide = await Slider.findOne({index:index});
        let slide2 = await Slider.findOne({index:index-1});
        slide2.index+=1;
        await slide2.save();
        slide.index-=1;
        await slide.save();
        res.status(200).json(null);
    }catch(err){
        console.log(err);
    }
});

router.route('/sliderMoveUp').post(async (req,res)=>{
    let {index} = req.body;
    try{
        let slide = await Slider.findOne({index:index});
        let slide2 = await Slider.findOne({index:index+1});
        slide2.index-=1;
        await slide2.save();
        slide.index+=1;
        await slide.save();
        res.status(200).json(null);
    }catch(err){
        console.log(err);
    }
});

module.exports = router;
