const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
    authorName:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Team"
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
    cover:{
        type: String,
        required: true, 
    },
    public:{
        type:Boolean,
        default:false
    },
    approvalStatus: {
        type: String,
        default: "submit",
      },
    createdAt:{
        type: Date,
        default: Date.now
    },
  });

  module.exports = mongoose.model('Blog', BlogSchema);