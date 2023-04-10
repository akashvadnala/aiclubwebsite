const mongoose = require('mongoose');

const leaderBoardSchema = new mongoose.Schema({
    compete: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Competitions",
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompeteTeam"
    },
    maxPublicScore: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    maxPrivateScore: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    numSubmissions: {
        type: Number,
        default:0
    }
}, { timestamps: true });

module.exports = mongoose.model('LeaderBoard', leaderBoardSchema);