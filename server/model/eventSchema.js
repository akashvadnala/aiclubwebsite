const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    url:{
        type: String,
        required:true
    },
    speakers:[{
        type: String,
    }],
    poster:{
        type: String,
        required:true
    },
    abstract:{
        type: String,
    },
    eventStart:{
        type:Date,
        required: true
    },
    eventEnd:{
        type: Date,
        require:true
    },
    eventLink:{
        type:String,
        default: ""
    },
    eventLocation:{
        type:String,
        default: ""
    },
},{ timestamps: true });

const Events = mongoose.model('Event',eventSchema)
module.exports = Events;