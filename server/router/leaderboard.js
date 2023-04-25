const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');
const CompeteTeam = require('../model/competeTeamSchema');
const Competitions = require('../model/competitionSchema');
const Leaderboard = require('../model/leaderBoardSchema');

router.route('/getLeaderboard/:id').get(async (req, res) => {
    try {
        const lb = await Leaderboard.find({ compete: req.params.id, numSubmissions: { $gt: 0 } }).sort({ 'maxPublicScore': -1 });
        let names = [];
        await Promise.all(
            lb.map(async ({ team, maxPublicScore, numSubmissions, updatedAt }) => {
                // if (numSubmissions > 0) {
                const user = await CompeteTeam.findById(team);
                names.push({ team: user.name, score: maxPublicScore, numSubmissions: numSubmissions, updatedAt: updatedAt });
                // }

            })
        )
        res.status(200).json(names);
    }
    catch (err) {
        res.status(400).json();
    }

})

router.route('/getPrivateLeaderboard/:id').get(async (req, res) => {
    try {
        const lbprivate = await Leaderboard.find({ compete: req.params.id, numSubmissions: { $gt: 0 } }).sort({ maxPrivateScore: -1 });
        const lbpublic = await Leaderboard.find({ compete: req.params.id, numSubmissions: { $gt: 0 } }).sort({ maxPublicScore: -1 });
        let data = [];
        await Promise.all(
            lbprivate.map(async ({ _id, team, maxPrivateScore, numSubmissions, updatedAt }, index) => {
                if (numSubmissions > 0) {
                    const user = await CompeteTeam.findById(team);
                    const difference = lbpublic.findIndex(x => x._id.equals(_id)) - index;
                    data.push({ team: user.name, score: maxPrivateScore, difference: difference, numSubmissions: numSubmissions, updatedAt: updatedAt });
                }
            })
        )
        res.status(200).json(data);
    }
    catch (err) {
        res.status(400).json();
    }
})

router.route('/getAllSubmissions/:id').get(async (req, res) => {
    try {
        const lb = await Leaderboard.find({ compete: req.params.id });
        let names = [];
        await Promise.all(
            lb.map(async ({ team, maxPublicScore, maxPrivateScore, numSubmissions, updatedAt }) => {
                const user = await CompeteTeam.findById(team);
                names.push({ team: user.name, maxPublicScore: maxPublicScore, maxPrivateScore: maxPrivateScore, numSubmissions: numSubmissions, updatedAt: updatedAt });
            })
        )
        res.status(200).json(names);
    }
    catch (err) {
        res.status(400).json();
    }
})

router.route('/getIsCompeteEnd/:id').get(async (req, res) => {
    try {
        const compete = await Competitions.findById(req.params.id);
        const date = new Date();
        res.status(200).json(date > compete.CompetitionEnd);
    } catch (err) {
        res.status(400).json();
    }
})

module.exports = router;