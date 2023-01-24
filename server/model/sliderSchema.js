const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    photo:{
        type: String,
        required: true,
    },
    title: {
        type: String,
        requied: true
    },
    caption1: {
        type: String,
    },
    caption2: {
        type: String,
    },
    link: {
        type: String,
        requied: true
    },
    textcolor: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Slider',sliderSchema);