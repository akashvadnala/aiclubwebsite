const mongoose = require("mongoose");

const telemapSchema = new mongoose.Schema({
    chatid:{
        type:Number,
        required:true,
    },
    username:{
        type:String,
        required:true,
    }
})

const Telemap = mongoose.model("telemap", telemapSchema);

module.exports = Telemap;