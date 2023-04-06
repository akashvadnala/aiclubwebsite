const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');

const Competitions = require('../model/competitionSchema');
const Leaderboard = require('../model/leaderBoardSchema');

router.route('/getLeaderboard/:id').get(async (req,res)=>{
    try{
        const lb = await Leaderboard.find({compete:req.params.id});
        if(lb){
            lb.sort((a,b)=>{a.publicScore>b.publicScore});
            res.status(200).json(lb);
        }
        else{
            res.status(201).json(null);
        }
    }catch(err){
        console.log('err');
    }
    
})


module.exports = router;