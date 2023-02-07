const express = require("express");
const router = express.Router();
const Slider = require('../model/sliderSchema');
const authenticate = require("../middleware/authenticate");

router.route('/getSlides').get(async (req,res)=>{
    try{
        let slides = await Slider.find({}).sort({index:"desc"});
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
        res.status(200).json(null);
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Internal server error"});
    }
});

router.route('/updateSlider/:id').put(authenticate,async (req,res)=>{
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
            res.status(204).json({msg:"Slider Not Found"});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Internal server error"});
    }    
});

router.route('/deleteSlider/:id').post(authenticate,async (req,res)=>{
    try{
        await Slider.findByIdAndDelete(req.params.id);
        res.status(200).json(null);
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Internal server error"});
    }
})

router.route('/sliderMoveDown').post(authenticate,async (req,res)=>{
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
        res.status(500).json({msg:"Internal server error"});
    }
});

router.route('/sliderMoveUp').post(authenticate,async (req,res)=>{
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
        res.status(500).json({msg:"Internal server error"});
    }
});

module.exports = router;
