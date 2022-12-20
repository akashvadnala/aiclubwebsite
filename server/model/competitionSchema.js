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
    public:{
        type: Boolean
    }
})

const Competitions = mongoose.model('Competitions',competitionSchema);

module.exports = Competitions;