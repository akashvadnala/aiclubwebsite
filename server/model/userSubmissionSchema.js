const mongoose = require('mongoose');

const userSubmissionSchema = new mongoose.Schema({
    compete: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Competitions",
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompeteTeam"
    },
    publicScore: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    privateScore: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    localFilePath: {
        type: String
    },
    googleDrivePath: {
        type: String
    },
    submissionLog: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('UserSubmission', userSubmissionSchema);