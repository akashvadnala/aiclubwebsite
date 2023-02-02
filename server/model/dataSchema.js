const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Data',dataSchema);