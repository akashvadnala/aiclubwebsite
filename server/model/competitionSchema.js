const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        requied: true
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Team"
    },
    access:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }],
    public:{
        type: Boolean
    }
})

const Competitions = mongoose.model('Competitions',competitionSchema);

module.exports = Competitions;