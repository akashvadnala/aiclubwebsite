const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');

const Competitions = require('../model/competitionSchema');
const Data = require('../model/dataSchema');

router.route('/getCData/:url').get(async (req,res)=>{
    try{
        const data = await Data.findOne({compete:req.params.url});
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(201).json(null);
        }
    }catch(err){
        console.log('err');
    }
    
})

router.route('/editCData/:id').put(async (req,res)=>{
    try{
        const updatedData = await Data.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        console.log('Updated Data',updatedData);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;