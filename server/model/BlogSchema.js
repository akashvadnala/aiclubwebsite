const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
    authorName:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: false, 
    },
    tags:[{
        type: String
    }],
    authorAvatar:{
        type: String,
        required: true, 
    },
    cover:{
        type: String,
        required: true, 
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

  module.exports = mongoose.model('Blog', BlogSchema);