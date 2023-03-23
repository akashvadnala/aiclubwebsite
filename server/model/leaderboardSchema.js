const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    compete:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Competitions",
    },
    description: {
        type: String
    },
    name:{
        type: String,
        required:true
    },
    team:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }],
    score:{
        type: mongoose.Schema.Types.Decimal128
    },
    submissions:{
        type: Number
    },
    last:{
        type: Date
    },
});

module.exports = mongoose.model('Leaderboard',leaderboardSchema);