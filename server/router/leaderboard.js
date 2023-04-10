const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');
const CompeteTeam = require('../model/competeTeamSchema');
const Competitions = require('../model/competitionSchema');
const Leaderboard = require('../model/leaderBoardSchema');

router.route('/getLeaderboard/:id').get(async (req, res) => {
    try {
        const lb = await Leaderboard.find({ compete: req.params.id }).sort({numSubmissions:-1});;
        let names = [];
        await Promise.all(
            lb.map(async ({ team, maxPublicScore, numSubmissions, updatedAt }) => {
                const user = await CompeteTeam.findById(team);
                names.push({team:user.name,maxPublicScore:maxPublicScore,numSubmissions:numSubmissions,updatedAt:updatedAt});
            })
        )
        res.status(200).json(names); 
    }
    catch (err) {
        console.log('err');
        res.status(400).json(); 
    }

})


module.exports = router;