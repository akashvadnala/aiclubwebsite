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
    },
    approvalStatus: {
        type: String,
        default: "submit",
      },
  },{ timestamps: true });

  module.exports = mongoose.model('Blog', BlogSchema);