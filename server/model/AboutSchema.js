const mongoose = require('mongoose');
const { Schema } = mongoose;

const AboutSchema = new Schema({
    about:{
        type: String,
        required: true,
        default: "AI Club NITC",
    },
  });

  module.exports = mongoose.model('About', AboutSchema);