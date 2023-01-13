const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');

const Competitions = require('../model/competitionSchema');
const Leaderboard = require('../model/leaderboardSchema');

router.route('/getLeaderboard/:url').get(async (req,res)=>{
    try{
        const lb = await Leaderboard.find({compete:req.params.url});
        if(lb){
            lb.sort((a,b)=>{a.score>b.score});
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