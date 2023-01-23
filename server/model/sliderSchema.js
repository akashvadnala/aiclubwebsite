const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    imgsrc:{
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
    linktitle: {
        type: String,
        requied: true
    },
    link: {
        type: String,
        requied: true
    },
});

module.exports = mongoose.model('Slider',sliderSchema);