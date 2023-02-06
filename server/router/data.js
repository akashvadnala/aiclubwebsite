const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');

const Competitions = require('../model/competitionSchema');
const Data = require('../model/dataSchema');

router.route('/getCData/:id').get(async (req,res)=>{
    try{
        const data = await Data.findOne({compete:req.params.id});
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(201).json(null);
        }
    }catch(err){
        console.log('err');
        res.status(500).json({msg:"Internal server error"});
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
        res.status(500).json({msg:"Internal server error"});
    }
})

module.exports = router;