const mongoose = require('mongoose');

const rulesSchema = new mongoose.Schema({
    compete:{
        type: String,
        required: true,
        ref: "Competitions",
    },
    description: {
        type: String,
        requied: true
    },
});

module.exports = mongoose.model('Rules',rulesSchema);