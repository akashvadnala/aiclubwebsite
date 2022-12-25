const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    creator:{
        type:String,
        required:true
    },
    authors:[
        {
            type:String
        }
    ],
    tags:[
        {
            type:String
        }
    ],
    content:{
        type:String
    },
    cover:{
        type:String,
        required:true
    },
    public:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Project', projectSchema);