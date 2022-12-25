const mongoose = require('mongoose');

const overviewSchema = new mongoose.Schema({
    compete:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Competitions",
    },
    description: {
        type: String,
        requied: true
    },
});

module.exports = mongoose.model('Overview',overviewSchema);