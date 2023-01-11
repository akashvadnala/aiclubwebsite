const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');

const Competitions = require('../model/competitionSchema');
const Overview = require('../model/overviewSchema');

router.route('/getOverview/:url').get(async (req,res)=>{
    try{
        const overview = await Overview.findOne({compete:req.params.url});
        if(overview){
            res.status(200).json(overview);
        }
        else{
            res.status(201).json(null);
        }
    }catch(err){
        console.log('err');
    }
    
})

router.route('/editOverview/:id').put(async (req,res)=>{
    try{
        const updatedData = await Overview.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        console.log('Updated Overview',updatedData);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;