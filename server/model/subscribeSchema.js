const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriberSchema = new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true
    }
})

const Subscribe = mongoose.model('Subscriber',subscriberSchema);
module.exports = Subscribe;